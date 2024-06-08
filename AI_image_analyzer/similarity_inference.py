from image_helpers import convert_images_to_grayscale, crop_least_variant_patch, fetch_similar
import datasets as ds
import re
import torchvision.transforms as T
from transformers import AutoModel, AutoFeatureExtractor
import torch
import random
import os
from PIL import Image 
import numpy as np

def similarity_inference(directory):
    
    # Get color values for each component
    color_dict = {}
    for each_image in os.listdir(directory):
        image_path = os.path.join(directory, each_image)
        with Image.open(image_path) as img:
            width, height = img.size
            # add 50 random color values to color list
            colors = []
            for i in range(100):
                # choose random pixel
                random_x = random.randint(0, width - 1)
                random_y = random.randint(0, height - 1)
                random_pixel = img.getpixel((random_x, random_y))
                # if pixel is not white
                if random_pixel != (255, 255, 255): 
                    colors.append(random_pixel)
            colors_array = np.array(colors)
            average_color_value = tuple(np.mean(colors_array, axis=0).astype(int))
            color_dict[each_image] = average_color_value

    convert_images_to_grayscale(directory)
    crop_least_variant_patch(directory)

    # define processing variables needed for embedding calculation
    root_directory = "data/" #"C:/Users/josie/OneDrive - Chalmers/Documents/Speckle hackathon/data/"
    model_ckpt = "nateraw/vit-base-beans" ## FIND DIFFERENT MODEL
    candidate_subset_emb = ds.load_dataset("canadianjosieharrison/2024hackathonembeddingdb")['train']
    extractor = AutoFeatureExtractor.from_pretrained(model_ckpt)
    model = AutoModel.from_pretrained(model_ckpt)
    transformation_chain = T.Compose(
        [
            # We first resize the input image to 256x256 and then we take center crop.
            T.Resize(int((256 / 224) * extractor.size["height"])),
            T.CenterCrop(extractor.size["height"]),
            T.ToTensor(),
            T.Normalize(mean=extractor.image_mean, std=extractor.image_std),
        ])
    device = "cuda" if torch.cuda.is_available() else "cpu"
    pt_directory = root_directory + "embedding_db.pt" #"materials/embedding_db.pt"
    all_candidate_embeddings = torch.load(pt_directory, map_location=device, weights_only=True)
    candidate_ids = []
    for id in range(len(candidate_subset_emb)):
        # Create a unique indentifier.
        entry = str(id) + "_" + str(random.random()).split('.')[1]
        candidate_ids.append(entry)

    # load all components
    test_ds = ds.load_dataset("imagefolder", data_dir=directory)
    label_filenames = ds.load_dataset("imagefolder", data_dir=directory).cast_column("image", ds.Image(decode=False))

    # loop through each component and return top 3 most similar
    match_dict = {"ceiling": [], 
                  "floor": [], 
                  "wall": []}
    for i, each_component in enumerate(test_ds['train']):
        query_image = each_component["image"]
        component_label = label_filenames['train'][i]['image']['path'].split('_')[-1].split("\\")[-1]
        rgb_color = color_dict[component_label]
        match = re.search(r"([a-zA-Z]+)(\d*)\.png", component_label)
        component_label = match.group(1)
        segment_id = match.group(2)
        sim_ids = fetch_similar(query_image, transformation_chain, device, model, all_candidate_embeddings, candidate_ids)
        for each_match in sim_ids:
            component_texture_id = str(segment_id) + "-" + str(each_match)
            texture_filename = candidate_subset_emb[each_match]['filenames']
            image_url = f'https://cdn.polyhaven.com/asset_img/thumbs/{texture_filename}?width=256&height=256'
            temp_dict = {"id": component_texture_id, "thumbnail": image_url, "name": texture_filename, "color": str(rgb_color)}
            match_dict[component_label].append(temp_dict)

    return match_dict
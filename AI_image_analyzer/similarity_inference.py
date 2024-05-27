from image_helpers import convert_images_to_grayscale, crop_center_largest_contour, fetch_similar
import datasets as ds
import re
import torchvision.transforms as T
from transformers import AutoModel, AutoFeatureExtractor
import torch
import random

def similarity_inference(directory):
    convert_images_to_grayscale(directory)
    crop_center_largest_contour(directory)

    # define processing variables needed for embedding calculation
    root_directory = "C:/Users/josie/OneDrive - Chalmers/Documents/Speckle hackathon/data/"
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
    pt_directory = root_directory + "materials/embedding_db.pt"
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
    match_dict = {"ceiling": [], "floor": [], "wall": []}
    for i, each_component in enumerate(test_ds['train']):
        query_image = each_component["image"]
        component_label = label_filenames['train'][i]['image']['path'].split('_')[-1]
        print(component_label)
        match = re.search(r"([a-zA-Z]+)\d*\.png", component_label)
        component_label = match.group(1)
        sim_ids = fetch_similar(query_image, transformation_chain, device, model, all_candidate_embeddings, candidate_ids)
        for each_match in sim_ids:
            texture_filename = candidate_subset_emb[each_match]['filenames']
            image_url = f'https://cdn.polyhaven.com/asset_img/thumbs/{texture_filename}?width=256&height=256'
            match_dict[component_label].append(image_url)

    return match_dict
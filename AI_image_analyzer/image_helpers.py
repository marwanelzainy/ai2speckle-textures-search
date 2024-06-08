import os
from PIL import Image 
from cv2 import imread, cvtColor, COLOR_BGR2GRAY, COLOR_BGR2BGRA, COLOR_BGRA2RGB, threshold, THRESH_BINARY_INV, findContours, RETR_EXTERNAL, CHAIN_APPROX_SIMPLE, contourArea, minEnclosingCircle
import numpy as np
import torch
import matplotlib.pyplot as plt

def convert_images_to_grayscale(folder_path):
    # Check if the folder exists
    if not os.path.isdir(folder_path):
        print(f"The folder path {folder_path} does not exist.")
        return
    
    # Iterate over all files in the folder
    for filename in os.listdir(folder_path):
        if filename.endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif')):
            image_path = os.path.join(folder_path, filename)
            
            # Open an image file
            with Image.open(image_path) as img:
                # Convert image to grayscale
                grayscale_img = img.convert('L').convert('RGB')
                grayscale_img.save(os.path.join(folder_path, filename))

def crop_center_largest_contour(folder_path):
    for each_image in os.listdir(folder_path):
        image_path = os.path.join(folder_path, each_image)
        image = imread(image_path)
        gray_image = cvtColor(image, COLOR_BGR2GRAY)

        # Threshold the image to get the non-white pixels
        _, binary_mask = threshold(gray_image, 254, 255, THRESH_BINARY_INV)

        # Find the largest contour
        contours, _ = findContours(binary_mask, RETR_EXTERNAL, CHAIN_APPROX_SIMPLE)
        largest_contour = max(contours, key=contourArea)

        # Get the minimum enclosing circle
        (x, y), radius = minEnclosingCircle(largest_contour)
        center = (int(x), int(y))
        radius = int(radius/3) # Divide by three (arbitrary) to make shape better

        # Crop the image to the bounding box of the circle
        x_min = max(0, center[0] - radius)
        x_max = min(image.shape[1], center[0] + radius)
        y_min = max(0, center[1] - radius)
        y_max = min(image.shape[0], center[1] + radius)
        cropped_image = image[y_min:y_max, x_min:x_max]
        cropped_image_rgba = cvtColor(cropped_image, COLOR_BGR2BGRA)
        cropped_pil_image = Image.fromarray(cvtColor(cropped_image_rgba, COLOR_BGRA2RGB))
        cropped_pil_image.save(image_path)

def extract_embeddings(transformation_chain, model: torch.nn.Module):
    """Utility to compute embeddings."""
    device = model.device

    def pp(batch):
        images = batch["image"]
        image_batch_transformed = torch.stack(
            [transformation_chain(image) for image in images]
        )
        new_batch = {"pixel_values": image_batch_transformed.to(device)}
        with torch.no_grad():
            embeddings = model(**new_batch).last_hidden_state[:, 0].cpu()
        return {"embeddings": embeddings}

    return pp

def compute_scores(emb_one, emb_two):
    """Computes cosine similarity between two vectors."""
    scores = torch.nn.functional.cosine_similarity(emb_one, emb_two)
    return scores.numpy().tolist()


def fetch_similar(image, transformation_chain, device, model, all_candidate_embeddings, candidate_ids, top_k=3):
    """Fetches the `top_k` similar images with `image` as the query."""
    # Prepare the input query image for embedding computation.
    image_transformed = transformation_chain(image).unsqueeze(0)
    new_batch = {"pixel_values": image_transformed.to(device)}

    # Compute the embedding.
    with torch.no_grad():
        query_embeddings = model(**new_batch).last_hidden_state[:, 0].cpu()

    # Compute similarity scores with all the candidate images at one go.
    # We also create a mapping between the candidate image identifiers
    # and their similarity scores with the query image.
    sim_scores = compute_scores(all_candidate_embeddings, query_embeddings)
    similarity_mapping = dict(zip(candidate_ids, sim_scores))
 
    # Sort the mapping dictionary and return `top_k` candidates.
    similarity_mapping_sorted = dict(
        sorted(similarity_mapping.items(), key=lambda x: x[1], reverse=True)
    )
    id_entries = list(similarity_mapping_sorted.keys())[:top_k]

    ids = list(map(lambda x: int(x.split("_")[0]), id_entries))
    return ids 

def plot_images(images):

    plt.figure(figsize=(20, 10))
    columns = 6
    for (i, image) in enumerate(images):
        ax = plt.subplot(int(len(images) / columns + 1), columns, i + 1)
        if i == 0:
            ax.set_title("Query Image\n")
        else:
            ax.set_title(
                "Similar Image # " + str(i) 
            )
        plt.imshow(np.array(image).astype("int"))
        plt.axis("off")

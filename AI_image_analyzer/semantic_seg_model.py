import torch
from transformers import pipeline, AutoImageProcessor, SegformerForSemanticSegmentation
from typing import List
from PIL import Image, ImageDraw, ImageFont, ImageChops, ImageMorph
import numpy as np
import datasets

def find_center_of_non_black_pixels(image):
    # Get image dimensions
    width, height = image.size
    
    # Iterate over the pixels to find the center of the non-black pixels
    total_x = 0
    total_y = 0
    num_non_black_pixels = 0
    top, left, bottom, right = height, width, 0, 0
    for y in range(height):
        for x in range(width):
            pixel = image.getpixel((x, y))
            if pixel != (255, 255, 255):  # Non-black pixel
                total_x += x
                total_y += y
                num_non_black_pixels += 1
                top = min(top, y)
                left = min(left, x)
                bottom = max(bottom, y)
                right = max(right, x)
    
    bbox_width = right - left
    bbox_height = bottom - top
    bbox_size = max(bbox_height, bbox_width)
    # Calculate the center of the non-black pixels
    if num_non_black_pixels == 0:
        return None  # No non-black pixels found
    center_x = total_x // num_non_black_pixels
    center_y = total_y // num_non_black_pixels
    return (center_x, center_y), bbox_size

def create_centered_image(image, center, bbox_size):
    # Get image dimensions
    width, height = image.size
    
    # Calculate the offset to center the non-black pixels in the new image
    offset_x = bbox_size // 2 - center[0]
    offset_y = bbox_size // 2 - center[1]
    
    # Create a new image with the same size as the original image
    new_image = Image.new("RGB", (bbox_size, bbox_size), color=(255, 255, 255))
    
    # Paste the non-black pixels onto the new image
    new_image.paste(image, (offset_x, offset_y))

    return new_image

def ade_palette():
    """ADE20K palette that maps each class to RGB values."""
    return [
        [180, 120, 20],
        [180, 120, 120],
        [6, 230, 230],
        [80, 50, 50],
        [4, 200, 3],
        [120, 120, 80],
        [140, 140, 140],
        [204, 5, 255],
        [230, 230, 230],
        [4, 250, 7],
        [224, 5, 255],
        [235, 255, 7],
        [150, 5, 61],
        [120, 120, 70],
        [8, 255, 51],
        [255, 6, 82],
        [143, 255, 140],
        [204, 255, 4],
        [255, 51, 7],
        [204, 70, 3],
        [0, 102, 200],
        [61, 230, 250],
        [255, 6, 51],
        [11, 102, 255],
        [255, 7, 71],
        [255, 9, 224],
        [9, 7, 230],
        [220, 220, 220],
        [255, 9, 92],
        [112, 9, 255],
        [8, 255, 214],
        [7, 255, 224],
        [255, 184, 6],
        [10, 255, 71],
        [255, 41, 10],
        [7, 255, 255],
        [224, 255, 8],
        [102, 8, 255],
        [255, 61, 6],
        [255, 194, 7],
        [255, 122, 8],
        [0, 255, 20],
        [255, 8, 41],
        [255, 5, 153],
        [6, 51, 255],
        [235, 12, 255],
        [160, 150, 20],
        [0, 163, 255],
        [140, 140, 140],
        [250, 10, 15],
        [20, 255, 0],
        [31, 255, 0],
        [255, 31, 0],
        [255, 224, 0],
        [153, 255, 0],
        [0, 0, 255],
        [255, 71, 0],
        [0, 235, 255],
        [0, 173, 255],
        [31, 0, 255],
        [11, 200, 200],
        [255, 82, 0],
        [0, 255, 245],
        [0, 61, 255],
        [0, 255, 112],
        [0, 255, 133],
        [255, 0, 0],
        [255, 163, 0],
        [255, 102, 0],
        [194, 255, 0],
        [0, 143, 255],
        [51, 255, 0],
        [0, 82, 255],
        [0, 255, 41],
        [0, 255, 173],
        [10, 0, 255],
        [173, 255, 0],
        [0, 255, 153],
        [255, 92, 0],
        [255, 0, 255],
        [255, 0, 245],
        [255, 0, 102],
        [255, 173, 0],
        [255, 0, 20],
        [255, 184, 184],
        [0, 31, 255],
        [0, 255, 61],
        [0, 71, 255],
        [255, 0, 204],
        [0, 255, 194],
        [0, 255, 82],
        [0, 10, 255],
        [0, 112, 255],
        [51, 0, 255],
        [0, 194, 255],
        [0, 122, 255],
        [0, 255, 163],
        [255, 153, 0],
        [0, 255, 10],
        [255, 112, 0],
        [143, 255, 0],
        [82, 0, 255],
        [163, 255, 0],
        [255, 235, 0],
        [8, 184, 170],
        [133, 0, 255],
        [0, 255, 92],
        [184, 0, 255],
        [255, 0, 31],
        [0, 184, 255],
        [0, 214, 255],
        [255, 0, 112],
        [92, 255, 0],
        [0, 224, 255],
        [112, 224, 255],
        [70, 184, 160],
        [163, 0, 255],
        [153, 0, 255],
        [71, 255, 0],
        [255, 0, 163],
        [255, 204, 0],
        [255, 0, 143],
        [0, 255, 235],
        [133, 255, 0],
        [255, 0, 235],
        [245, 0, 255],
        [255, 0, 122],
        [255, 245, 0],
        [10, 190, 212],
        [214, 255, 0],
        [0, 204, 255],
        [20, 0, 255],
        [255, 255, 0],
        [0, 153, 255],
        [0, 41, 255],
        [0, 255, 204],
        [41, 0, 255],
        [41, 255, 0],
        [173, 0, 255],
        [0, 245, 255],
        [71, 0, 255],
        [122, 0, 255],
        [0, 255, 184],
        [0, 92, 255],
        [184, 255, 0],
        [0, 133, 255],
        [255, 214, 0],
        [25, 194, 194],
        [102, 255, 0],
        [92, 0, 255],
    ]

def label_to_color_image(label, colormap):
    if label.ndim != 2:
        raise ValueError("Expect 2-D input label")

    if np.max(label) >= len(colormap):
        raise ValueError("label value too large.")

    return colormap[label]

labels_list = []

with open(r'labels.txt', 'r') as fp:
    for line in fp:
        labels_list.append(line[:-1])

colormap = np.asarray(ade_palette())
LABEL_NAMES = np.asarray(labels_list)
LABEL_TO_INDEX = {label: i for i, label in enumerate(labels_list)}
FULL_LABEL_MAP = np.arange(len(LABEL_NAMES)).reshape(len(LABEL_NAMES), 1)
FULL_COLOR_MAP = label_to_color_image(FULL_LABEL_MAP, colormap)
FONT = ImageFont.truetype("Arial.ttf", 1000)

def lift_black_value(image, lift_amount):
    """
    Increase the black values of an image by a specified amount.
    
    Parameters:
        image (PIL.Image): The image to adjust.
        lift_amount (int): The amount to increase the brightness of the darker pixels.
        
    Returns:
        PIL.Image: The adjusted image with lifted black values.
    """
    # Ensure that we don't go out of the 0-255 range for any pixel value
    def adjust_value(value):
        return min(255, max(0, value + lift_amount))
    
    # Apply the point function to each channel
    return image.point(adjust_value)

torch.set_grad_enabled(False)

DEVICE = 'cuda' if torch.cuda.is_available() else "cpu"
# MIN_AREA_THRESHOLD = 0.01

pipe = pipeline("image-segmentation", model="nvidia/segformer-b5-finetuned-ade-640-640")

def segmentation_inference(
        image_rgb_pil: Image.Image,
        savepath: str
):
    outputs = pipe(image_rgb_pil, points_per_batch=32)
    
    for i, prediction in enumerate(outputs):
        label = prediction['label']
        if (label == "floor") | (label == "wall") | (label == "ceiling"): 
            mask = prediction['mask']

            ## Save mask
            label_savepath = savepath + label + str(i) + '.png'
            fill_image = Image.new("RGB", image_rgb_pil.size, color=(255,255,255))
            cutout_image = Image.composite(image_rgb_pil, fill_image, mask)

            # Crop mask
            center, bbox_size = find_center_of_non_black_pixels(cutout_image)
            if center is not None:
                centered_image = create_centered_image(cutout_image, center, bbox_size)
                centered_image.save(label_savepath)

            ## Inspect masks
            # inverted_mask = ImageChops.invert(mask)
            # mask_adjusted = lift_black_value(inverted_mask, 100)
            # color_index = LABEL_TO_INDEX[label]
            # color = tuple(FULL_COLOR_MAP[color_index][0])
            # fill_image = Image.new("RGB", image_rgb_pil.size, color=color)
            # image_rgb_pil = Image.composite(image_rgb_pil, fill_image, mask_adjusted)

    # Display the final image
    # image_rgb_pil.show()

def online_segmentation_inference(
        image_rgb_pil: Image.Image
):
    outputs = pipe(image_rgb_pil, points_per_batch=32)
    
    # Create an image dictionary
    image_dict = {"image": [], "label":[]}

    for i, prediction in enumerate(outputs):
        label = prediction['label']
        if (label == "floor") | (label == "wall") | (label == "ceiling"): 
            mask = prediction['mask']

            fill_image = Image.new("RGB", image_rgb_pil.size, color=(255,255,255))
            cutout_image = Image.composite(image_rgb_pil, fill_image, mask)

            # Crop mask
            center, bbox_size = find_center_of_non_black_pixels(cutout_image)
            if center is not None:
                centered_image = create_centered_image(cutout_image, center, bbox_size)

                # Add image to image dictionary
                image_dict["image"].append(centered_image)
                image_dict["label"].append(label)

    segmented_ds = datasets.Dataset.from_dict(image_dict).cast_column("image", datasets.Image())
    return segmented_ds
                
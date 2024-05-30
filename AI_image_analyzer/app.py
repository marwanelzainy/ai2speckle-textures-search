from fastapi import FastAPI, UploadFile, File, HTTPException
import os
import shutil
from PIL import Image
from semantic_seg_model import segmentation_inference
from similarity_inference import similarity_inference
import json

app = FastAPI()

## Initialize the pipeline
input_images_dir = "image/"
temp_processing_dir = input_images_dir + "processed/"

# Define a function to handle the POST request at `imageAnalyzer`
@app.post("/imageAnalyzer")
def imageAnalyzer(image: UploadFile = File(...)):
    """
    This function takes in an image filepath and will return the PolyHaven url addresses of the 
    top k materials similar to the wall, ceiling, and floor.
    """
    try:
        # load image
        image_path = os.path.join(input_images_dir, image.filename)
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image = Image.open(image_path)

        # segment into components
        segmentation_inference(image, temp_processing_dir)

        # identify similar materials for each component
        matching_urls = similarity_inference(temp_processing_dir)
        print(matching_urls)

        # Return the urls in a JSON response
        return matching_urls
    
    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail=str(e))
import base64
import io
from fastapi import FastAPI, UploadFile, File, HTTPException
import os
import shutil
from PIL import Image
from fastapi.responses import JSONResponse
from semantic_seg_model import segmentation_inference
from similarity_inference import similarity_inference
import json
from gradio_client import Client, file

app = FastAPI(docs_url="/")

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
    

client = Client("MykolaL/StableDesign")

@app.post("/image-render")
def imageRender(prompt: str, image: UploadFile = File(...)):
    """
    Makes a prediction using the "StableDesign" model hosted on a server.

    Returns:
        The prediction result.
    """
    try:
        image_path = os.path.join(input_images_dir, image.filename)
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image = Image.open(image_path)
        # Convert PIL image to the required format for the prediction model, if necessary
        # This example assumes the model accepts PIL images directly
        
        result = client.predict(
                image=file(image_path),
                text=prompt,
                num_steps=50,
                guidance_scale=10,
                seed=1111664444,
                strength=0.9,
                a_prompt="interior design, 4K, high resolution, photorealistic",
                n_prompt="window, door, low resolution, banner, logo, watermark, text, deformed, blurry, out of focus, surreal, ugly, beginner",
                img_size=768,
                api_name="/on_submit"
        )
        image_path = result
        if not os.path.exists(image_path):
            raise HTTPException(status_code=404, detail="Image not found")
        
        # Open the image file and convert it to base64
        with open(image_path, "rb") as img_file:
            base64_str = base64.b64encode(img_file.read()).decode('utf-8')
        
        return JSONResponse(content={"image": base64_str}, status_code=200)
    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail=str(e))
    

# @app.get("/")
# def test():
#     return {"Hello": "World"}
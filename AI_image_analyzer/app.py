import base64
import io
from fastapi import FastAPI, UploadFile, File, HTTPException
import os
import shutil
from PIL import Image
from fastapi.responses import JSONResponse
from semantic_seg_model import segmentation_inference
from similarity_inference import similarity_inference
from gradio_client import Client, file
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(docs_url="/")

allowed_origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

## Initialize the pipeline
input_images_dir = "image/"
temp_processing_dir = input_images_dir + "processed/"

# Define a function to handle the POST request at `image-analyzer`
@app.post("/image-analyzer")
def image_analyzer(image: UploadFile = File(...)):
    """
    This function takes in an image filepath and will return the PolyHaven url addresses of the 
    top k materials similar to the wall, ceiling, and floor.
    """
    try:
        # load image
        image_path = os.path.join(input_images_dir, "image.png")
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image = Image.open(image_path)
        print("image loaded successfully. Processing image for segmentation and similarity inference...", datetime.now())
        # segment into components
        segmentation_inference(image, temp_processing_dir)
        print("image segmented successfully. Starting similarity inference...", datetime.now())
        # identify similar materials for each component
        matching_textures = similarity_inference(temp_processing_dir)
        print("done", datetime.now())

        # Return the urls in a JSON response
        return matching_textures
    
    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail=str(e))
    

client = Client("MykolaL/StableDesign")

@app.post("/image-render")
async def image_render(prompt: str, image: UploadFile = File(...)):
    """
    Makes a prediction using the "StableDesign" model hosted on a server.

    Returns:
        The prediction result.
    """
    try:
        print(f"recieved prompt: {prompt} and image: {image}")
        image_path = os.path.join(input_images_dir, image.filename+datetime.now().strftime("%Y-%m-%d_%H-%M-%S")+".png")
        contents = await image.read()
        # Remove the prefix "data:image/png;base64,"
        image_data = contents.split(b";base64,")[1]
        # Decode base64 data
        decoded_image = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(decoded_image))
        # Convert image to grayscale
        grayscale_image = image.convert('L')
        # Save the processed image to the specified path
        grayscale_image.save(image_path)
        result = client.predict(
                image=file(image_path),
                text=prompt,
                num_steps=50,
                guidance_scale=10,
                seed=1111664444,
                strength=1,
                a_prompt="interior design, 4K, high resolution, photorealistic",
                n_prompt="window, door, low resolution, banner, logo, watermark, text, deformed, blurry, out of focus, surreal, ugly, beginner",
                img_size=768,
                api_name="/on_submit"
        )

        new_image_path = result
        if not os.path.exists(new_image_path):
            raise HTTPException(status_code=404, detail="Image not found")
        
        # Open the image file and convert it to base64
        with open(new_image_path, "rb") as img_file:
            base64_str = base64.b64encode(img_file.read()).decode('utf-8')
            
        return JSONResponse(content={"image": base64_str}, status_code=200)
    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail=str(e))
    
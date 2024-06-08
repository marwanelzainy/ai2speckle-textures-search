[![Netlify Status](https://api.netlify.com/api/v1/badges/cc65ce29-6c3f-4163-8623-296aeb65cc87/deploy-status)](https://app.netlify.com/sites/ai2speckle/deploys)
# ai2speckle: Textures search
![image](https://drive.google.com/uc?export=view&id=1WJfsmOxAo_4Xp9vwAxm57CzD5P7SAWsS)

## Documentation

![image](https://drive.google.com/uc?export=view&id=1Fio5xeZT2WQn_UehD37LkC74QGL4vKka)

In the above diagram, There are three components to our "ai2SpeckleApp:matgen Web Application"

1. A Front-end React Page that loads a Speckle Stream Viewer(3D Object Loader) via an authentication page through your Speckle account.
   - AI Image Analyzer Application GUI Window: A Button that takes a snapshot of the stream and uses AI Render Image API to render the stream and feeds it to the AI Image Analyzer Application based on whether the user accepts it.
   - A Button that calls the AI image Analyzer Application that then applies material to the elements in the Speckle Stream.

2. An AI Image Renderer Application GUI Window
   This window does have a text prompt for the user to enter the Text Prompt which opens an "AI Image Rendered" window. The user has an option to either continue,re-render, or change the prompt for re-rendering. 
   For the AI Image Rendering, when we click the AI Render or Rerender button, the button makes an API call to the free available state-of-the-art Image to Image AI Generators in the Generative AI community.
   
   We explored several Free Image to Image AI Renderers that offer free or paid pricing for API usage outlined below: 
- [Monster API using ZeroGPU from HuggingFace](https://developer.monsterapi.ai/reference/post_generate-img2img)
- [Automatic 111 Web UI using Google Colab](https://github.com/AUTOMATIC1111/stable-diffusion-webui)
- [Limewire Developer API](https://developer.limewire.com/image-to-image)
- [Deep AI (Ai Image Generator API)](https://deepai.org/docs)-

  For this hackathon, the most promising solution for the Image-to-Image Generation API for our "AI Image Rendering Application" is:[Stable Diffusion Hugging Face API ](https://huggingface.co/spaces/MykolaL/StableDesign)
  
3. AI Image Analyzer Application GUI Window(AI Workflow diagram)

   When the user is satisfied with 2 and proceeds with the "Continue" button, it sends the Rendered Image to the AI Image Analyzer Application GUI Window.
   This GUI window has a Machine Learning pipeline that generates Material as JPG/PNG which are hosted on PolyHaven so the user can download with a downloadable link
   Under the hood of this machine learning pipeline, there are several steps like Image Segmentation, Image Recognition from the Hugging Face dataset, and Image Similarity search to identify the materials based on labels inside the datasets
   and lastly post-processing the segmented labeled image from AI render Image to new materials.

   This technique expands the material database for users to select and apply later either to their BIM Applications or CAD software like Unreal,Unity3D,etc.

   All with the Power of the Speckle !!

## INSTALLATION 

  Please follow the steps on the authentication for installing this repository
   
## FUTURE IMPROVEMENTS

![image](https://drive.google.com/uc?export=view&id=1mYlxp9jANl7ho2QhP9nc0QpsO52VdFGO)

## Credits | Teammates

Josie Harrison (Machine Learning Developer)
Marwan Elzainy(Fullstack Developer)
Jordana Rosa(Idea Conception)
Abhishek Shinde(Researcher|Documentation)


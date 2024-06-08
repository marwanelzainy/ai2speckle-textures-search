# ai2SpeckleApp:matGen

![image](https://drive.google.com/uc?export=view&id=1WJfsmOxAo_4Xp9vwAxm57CzD5P7SAWsS)

## Teammates

Josie Harrison (Machine Learning Developer)
Marwan Elzainy(Fullstack Developer)
Jordana Rosa(Idea Conception)
Abhishek Shinde(Research|Documentation)

## Documentation

![image](https://drive.google.com/uc?export=view&id=1Fio5xeZT2WQn_UehD37LkC74QGL4vKka)

In the above diagram, There are three components to our ai2SpeckleApp:matgen Web Application

1. A React web app which consists of:
   - Speckle Stream Viewer(3D Object Loader) via authentication
   - A Button that takes a snapshot of the stream and uses AI Render Image API to render the stream and feeds it to the AI Image Analyzer Application based on whether the user accepts it.
   - A Button that calls the AI image Analyzer Application that then applies material to the elements in the Speckle Stream.
2. An AI Image Analyzer Application that generates 3JS material maps by segmenting and post-processing the segmented labeled image from AI render.( Part of AI Workflow)
3. An AI Image Render Application that does an API call to the free available state-of-the-art Image to Image AI Generators in the Generative AI community.( Part of AI Workflow)

## RESEARCH

There are currently two limitations in our workflows.

1. AI Image Render API Landscape

We explored several Free Image to Image AI Renderers that offer free or paid pricing for API usage outlined below

- [Monster API using ZeroGPU from HuggingFace](https://developer.monsterapi.ai/reference/post_generate-img2img)
- [Automatic 111 Web UI using Google Colab](https://github.com/AUTOMATIC1111/stable-diffusion-webui)
- [Limewire Developer API](https://developer.limewire.com/image-to-image)
- [Deep AI (Ai Image Generator API)](https://deepai.org/docs)-

The most promising solution for Image-to-Image Generation API, which we selected for our "AI Image Analyzer Application" is :[Stable Diffusion Hugging Face API ](https://huggingface.co/spaces/MykolaL/StableDesign)

2. Currently, Speckle 2.4.0 Material Support allows for multiple materials for built elements such as Walls, Roofs, and Beams from a Stream sent from Revit, Archicad, Rhino, and Autocad.
   However, the latest Speckle Material API dated 06-01-2024 does not allow for Texture to be sent or received from Speckle Stream but only as Flat colors. Hence, we limit our research to
   just displaying Material options in a Window.

## FUTURE IMPROVEMENTS

![image](https://drive.google.com/uc?export=view&id=1mYlxp9jANl7ho2QhP9nc0QpsO52VdFGO)


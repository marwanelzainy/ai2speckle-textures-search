# ai2SpeckleApp:matGen

![image](https://drive.google.com/uc?export=view&id=1TkPfhH8Ezakmusfvw7jpmoNrdYTvA9pq)

## Problem Statement

The original idea sprung from Jordana Rosa, our teammate with her current AI-powered Visualization workflows at Perkins+Wills. The problem statement she quotes is described as follows:

*"AI-powered BIM with Material Feedback Loop for Revit. Jordana's team is currently exploring AI Image generation tools like  Stable Diffusion & ComfyUI to generate stunning AI renders from various sources such as sketches, 3D models, and photos. However, these amazing images don't translate into BIM data – materials, lighting, humanization elements, etc. Here's where Speckle comes in: My idea is to leverage Speckle to bridge this gap. -Extract materials from AI-generated images: Imagine isolating "glass" or "wood" from the AI output. -Push this material data back to the BIM model: This creates a seamless workflow, saving time and improving collaboration. This two-way communication between AI and BIM offers exciting possibilities: -Faster material selection: Quickly populate models with materials suggested by AI renders. -Enhanced design exploration: Test various material combinations directly in the BIM environment. -Improved coordination: Eliminate inconsistencies between AI renders and BIM models."*

## Our Solution

Instead of Limiting our workflow merely to BIM Applications, we are looking at the much broader vision for Image to Image AI Applications in CAD Ecosystems like Rhinoceros3D, Blender, Unity, and Unreal Engine. These workflows can empower Interior Designers, Facade designers, early-stage design visualization, etc. Combined with Speckles Connectors, this app can also serve as a research Avenue for Text to 3D Generation. 

For this proposed vision, we are using a React Application with Speckle Viewer and 3JS functionalities combined with Advanced Image processing and segmentation algorithms for the "AI Image Analyzer" Pipeline and also open source Image to Image AI Rendering APIs for "AI Image Render" Pipeline. Everything is happening on the Front-end and we will get into specifics of it in our documentation. 

## Teammates

Josie Harrison (Machine Learning Developer)
Marwan Elzainy(Fullstack Developer)
Jordana Rosa(Idea Conception)
Abhishek Shinde(Research|Documentation)

## Documentation

There are three components to the dallESpeckleMap React App

1. A React web app which consists of:
   - Speckle Stream Viewer via authentication
   - A Button that takes a snapshot of the stream and uses AI Render Image API to render the stream and feeds it to the AI Image Analyzer Application based on whether the user accepts it.
   - A Button that calls the AI image Analyzer Application that then applies material to the elements in the Speckle Stream.
2. An AI Image Analyzer Application that generates 3JS material maps by segmenting and post-processing the segmented labeled image from AI render.
3. An AI Image Render Application that does an API call to the free available state-of-the-art Image to Image AI Generators in the Generative AI community.

## Limitation

There are currently two limitations in our workflows.

1. AI Image Render API Landscape

We explored the Free Image to Image AI Renderers which offer API with minimal to free cost. Based on our exploration, we explored several APIs that offer free or paid pricing for API usage.

The most promising ones for Image-to-Image Generation API are:

- [Monster API using ZeroGPU from HuggingFace](https://developer.monsterapi.ai/reference/post_generate-img2img)
- [Automatic 111 Web UI using Google Colab](https://github.com/AUTOMATIC1111/stable-diffusion-webui)
- [Limewire Developer API](https://developer.limewire.com/image-to-image)
- [Deep AI (Ai Image Generator API)](https://deepai.org/docs)-

The end goal with our AI Image Analyzer Application looks similar to this project we found on Hugging Face: [Link ](https://huggingface.co/spaces/MykolaL/StableDesign)

2. Currently, Speckle 2.4.0 Material Support allows for multiple materials for built elements such as Walls, Roofs, and Beams from a Stream sent from Revit, Archicad, Rhino, and Autocad.
   However, the latest Speckle Material API dated 06-01-2024 does not allow for Texture to be sent or received from Speckle Stream but only as Flat colors. Hence, we limit our research to
   just displaying Material options in a Window.

## Installation

Work in Progress!!

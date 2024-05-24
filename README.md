# dallESpeckleMap

[![Netlify Status](https://api.netlify.com/api/v1/badges/cc65ce29-6c3f-4163-8623-296aeb65cc87/deploy-status)](https://app.netlify.com/sites/ai2speckle/deploys)

## Problem Statement

The original idea sprung from Jordana Rosa, our teammate with her current workflows at Perkins+Wills. The problem statement is described as follows:

_"AI-powered BIM with Material Feedback Loop for Revit. Currently, We're using Stable Diffusion to generate stunning AI renders from various sources such as sketches, 3D models, and photos. However, these amazing images don't translate back into BIM data – materials, lighting, humanization elements, etc. Here's where Speckle comes in: My idea is to leverage Speckle to bridge this gap. -Extract materials from AI-generated images: Imagine isolating "glass" or "wood" from the AI output. -Push this material data back to the BIM model: This creates a seamless workflow, saving time and improving collaboration. This two-way communication between AI and BIM offers exciting possibilities: -Faster material selection: Quickly populate models with materials suggested by AI renders. -Enhanced design exploration: Test various material combinations directly in the BIM environment. -Improved coordination: Eliminate inconsistencies between AI renders and BIM models. Looking for Teammates: Ideally, you'll have expertise in: -Speckle: A deep understanding of Speckle's functionalities and APIs. -BIM app development: Experience with BIM software and data exchange between platforms. -AI/Machine Learning: Knowledge of image recognition/material extraction techniques."_

## Our Solution

We want to solve this using a Full Stack Speckle solution powered with Speckle Automate and Speckle Material + 3JS material functionalities combined with Advanced Image processing algorithms

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

## Installation

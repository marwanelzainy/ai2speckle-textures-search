import {
  CameraController,
  SelectionExtension,
  SpeckleStandardMaterial,
} from "@speckle/viewer";
import { button, buttonGroup, folder, Leva, useControls } from "leva";
import { useState } from "react";
import * as THREE from "three";
import { useViewer } from "../../context/viewer";
export default function ControlsComponent({
  togglePopup,
  setRender,
  materials,
  setMaterials,
}) {
  const viewer = useViewer();
  const camera = viewer.getExtension(CameraController);
  const selector = viewer.getExtension(SelectionExtension);
  const renderer = viewer.getRenderer();

  const texture = new THREE.TextureLoader().load(
    "https://threejs.org/examples/textures/uv_grid_opengl.jpg"
  );
  // immediately use the texture for material creation
  // console.log(texture);
  const [selectedMaterial, setSelectedMaterial] = useState();

  const speckleMaterial = new SpeckleStandardMaterial({
    color: 0xee0022,
    map: texture,
  });
  const materialParams = {
    map: texture,
    color: 0x0077ff, // Blue color (will be combined with the texture)
    roughness: 0.5, // Medium roughness
    metalness: 0.7, // Some metallic quality
    emissive: 0x000000, // No emissive color
    opacity: 0.9, // Slightly transparent
    transparent: true, // Allow transparency
    side: THREE.DoubleSide, // Double sided
  };
  const threeMaterial = new THREE.MeshStandardMaterial(materialParams);

  // TODO: Change material feed to be from AI
  // setMaterials([
  //   {
  //     materialName: "texture Material 1",
  //     material: {
  //       map: texture,
  //       color: 0xee0022,
  //       opacity: 1,
  //       roughness: 1,
  //       metalness: 0,
  //       vertexColors: false,
  //     },
  //   },
  //   {
  //     materialName: "Speckle Material",
  //     material: speckleMaterial,
  //   },
  //   {
  //     materialName: "Material 3",
  //     material: threeMaterial,
  //   },
  // ]);

  const [values, set] = useControls(
    () => ({
      "Materials List": folder(
        materials.reduce((config, material, index) => {
          config[`SizeButtonGroup${index}`] = buttonGroup({
            label: <img src={"logo"} style={{ width: 20, height: 20 }} />,
            opts: {
              [material.materialName]: () => {
                setSelectedMaterial(material);
                set({ selectedMaterial: material.materialName });
              },
              link: () => console.log(material.materialName),
            },
          });
          return config;
        }, {})
      ),
      selectedMaterial: {
        value: "",
        label: "Selected Material",
        editable: false,
      },
      "Assign material to selected object": button((get) => {
        if (!selectedMaterial) return alert("No material selected");
        const worldTree = viewer.getWorldTree();
        const node = selector.getSelectedNodes()[0];
        const nodeId = node.model.id;
        selector.unselectObjects([nodeId]);
        const renderTree = worldTree.getRenderTree(nodeId);
        const rvs = renderTree.getRenderViewsForNodeId(nodeId);
        // Apply material
        renderer.setMaterial(rvs, selectedMaterial.material);
        viewer.requestRender();
      }),
      // testbutton: button((get) => {
      //   //   const worldTree = viewer.getWorldTree();
      //   //   const node = selector.getSelectedNodes()[0];
      //   //   const nodeId = node.model.id;
      //   //   selector.unselectObjects([nodeId]);
      //   //   const renderTree = worldTree.getRenderTree(nodeId);
      //   //   const rvs = renderTree.getRenderViewsForNodeId(nodeId);
      //   //   const materials = renderer.getMaterial(rvs[0]);
      //   //   console.log(materials);
      //   viewer.screenshot().then(async (image) => {
      //     const formData = new FormData();

      //     // Convert the image to a Blob
      //     const blob = new Blob([image], {
      //       type: "image/png",
      //     });

      //     // Append the image Blob to the FormData object
      //     formData.append("image", blob, "render.png");

      //     // Send the POST request using fetch
      //     try {
      //       const response = await fetch("http://127.0.0.1:8000/image-test", {
      //         method: "POST",
      //         headers: {
      //           accept: "application/json",
      //           // 'Content-Type' is automatically set to 'multipart/form-data' when using FormData
      //         },
      //         mode: "cors", // CORS mode
      //         credentials: "same-origin",
      //         body: formData,
      //       });
      //       const result = await response.json();
      //       console.log("Success:", result);
      //       // setRender(result.image);
      //     } catch (error) {
      //       console.error("Error:", error);
      //     }
      //   });
      // }),
    }),
    [materials, selectedMaterial]
  );

  const values2 = useControls("AI Render", {
    textPrompt: { value: "", rows: true, label: "Text Prompt" },
    "AI Render": button((get) => {
      console.log("rendering...");
      const textPrompt = get("AI Render.textPrompt");
      if (!textPrompt) return alert(`Prompt is empty`);
      viewer.screenshot().then(async (image) => {
        const formData = new FormData();

        // Convert the image to a Blob
        const blob = new Blob([image], { type: "image/jpeg" });

        // Append the image Blob to the FormData object
        formData.append("image", blob);
        togglePopup();

        // Send the POST request using fetch
        try {
          const response = await fetch(
            "http://127.0.0.1:8000/image-render?prompt=" + textPrompt,
            {
              method: "POST",
              headers: {
                accept: "application/json",
                // 'Content-Type' is automatically set to 'multipart/form-data' when using FormData
              },
              mode: "cors", // CORS mode
              credentials: "same-origin",
              body: formData,
            }
          );
          const result = await response.json();
          // console.log("Success:", result);
          setRender(`data:image/png;base64,${result.image}`);
        } catch (error) {
          console.error("Error:", error);
        }
      });
      // alert(`This is the prompt: ${textPrompt}`);
    }),
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 75,
        right: 10,
        zIndex: 0,
        maxWidth: 300,
      }}
    >
      <Leva
        // theme={myTheme} // you can pass a custom theme (see the styling section)
        fill // default = false,  true makes the pane fill the parent dom node it's rendered in
        // flat // default = false,  true removes border radius and shadow
        // oneLineLabels // default = false, alternative layout for labels, with labels and fields on separate rows
        // hideTitleBar // default = false, hides the GUI header
        // collapsed // default = false, when true the GUI is collpased
        // hidden // default = false, when true the GUI is hidden
      />
    </div>
  );
}

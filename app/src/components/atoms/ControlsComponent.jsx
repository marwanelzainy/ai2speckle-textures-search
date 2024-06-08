import { SelectionExtension } from "@speckle/viewer";
import { button, buttonGroup, folder, Leva, useControls } from "leva";
import { useState } from "react";
import { useViewer } from "../../context/viewer";
import { AI_API_URL } from "App";
export default function ControlsComponent({
  togglePopup,
  setRender,
  materials,
  setMaterials,
}) {
  const viewer = useViewer();
  const selector = viewer.getExtension(SelectionExtension);
  const renderer = viewer.getRenderer();

  const [selectedMaterial, setSelectedMaterial] = useState();

  const values2 = useControls("AI Render", {
    textPrompt: { value: "", rows: true, label: "Text Prompt" },
    "AI Render": button((get) => {
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
            `${AI_API_URL}/image-render?prompt=${textPrompt}`,
            {
              method: "POST",
              headers: {
                accept: "application/json",
                "Access-Control-Allow-Origin": "*",
                // 'Content-Type' is automatically set to 'multipart/form-data' when using FormData
              },
              body: formData,
            }
          );
          const result = await response.json();
          setRender(`data:image/png;base64,${result.image}`);
        } catch (error) {
          console.error("Error:", error);
        }
      });
    }),
  });

  const [values, set] = useControls(
    () => ({
      "Materials List": folder(
        materials.reduce((config, material, index) => {
          config[`SizeButtonGroup${index}`] = buttonGroup({
            label: (
              <img src={material.thumbnail} style={{ width: 20, height: 20 }} />
            ),
            opts: {
              [material.materialName]: () => {
                setSelectedMaterial(material);
                set({ selectedMaterial: material.materialName });
              },
              link: () => {
                window.open(material.link, "_blank");
              },
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
      //   togglePopup();
      // }),
    }),
    [materials, selectedMaterial]
  );

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

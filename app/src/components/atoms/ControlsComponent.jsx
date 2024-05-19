import {
  CameraController,
  SelectionExtension,
  SpeckleStandardMaterial,
} from "@speckle/viewer";
import { button, buttonGroup, folder, Leva, useControls } from "leva";
import logo from "logo192.png";
import { useViewer } from "../../context/viewer";
import { useEffect, useState } from "react";
export default function ControlsComponent({ togglePopup }) {
  const viewer = useViewer();
  const camera = viewer.getExtension(CameraController);
  const selector = viewer.getExtension(SelectionExtension);
  const renderer = viewer.getRenderer();
  const material = new SpeckleStandardMaterial({ color: 0xffffff });

  const [selectedMaterial, setSelectedMaterial] = useState();

  // TODO: Change material feed to be from AI
  const [materials, setMaterials] = useState([
    {
      materialName: "Material 1",
      material: {
        color: 0xee0022,
        opacity: 1,
        roughness: 1,
        metalness: 0,
        vertexColors: false,
      },
    },
    {
      materialName: "Material 2",
      material: {
        color: 0x00ff00,
        opacity: 1,
        roughness: 1,
        metalness: 0,
        vertexColors: false,
      },
    },
  ]);

  const [values, set] = useControls(
    () => ({
      "Materials List": folder(
        materials.reduce((config, material, index) => {
          config[`SizeButtonGroup${index}`] = buttonGroup({
            label: <img src={logo} style={{ width: 20, height: 20 }} />,
            opts: {
              [material.materialName]: () => {
                setSelectedMaterial(material);
                set({ selectedMaterial: material.materialName });
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
    }),
    [materials, selectedMaterial]
  );

  const values2 = useControls("AI Render", {
    textPrompt: { value: "", rows: true, label: "Text Prompt" },
    "AI Render": button((get) => {
      const textPrompt = get("AI Render.textPrompt");
      if (!textPrompt) return alert(`Prompt is empty`);
      viewer.screenshot().then((data) => {
        console.log("screenshot", data);
      });
      togglePopup();
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

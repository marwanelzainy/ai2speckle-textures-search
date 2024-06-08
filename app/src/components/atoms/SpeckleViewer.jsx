import Controls from "./ControlsComponent";
import { useViewer } from "../../context/viewer";
import { useState } from "react";
import { RenderPopup } from "./RenderPopup";
export default function SpeckleViewer() {
  const viewer = useViewer();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [render, setRender] = useState();
  const [materials, setMaterials] = useState([]);
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  return (
    <>
      <div
        id="renderer"
        style={{
          // maxWidth: "1200px",
          width: "100%",
          height: "100%",
          left: 0,
          top: 0,
          // position: "absolute",
          zIndex: 0,
          // border: "1px solid black",
        }}
      />
      {viewer && (
        <div>
          <Controls
            togglePopup={togglePopup}
            setRender={setRender}
            setMaterials={setMaterials}
            materials={materials}
          />
          {isPopupOpen && (
            <RenderPopup
              togglePopup={togglePopup}
              render={render}
              setRender={setRender}
              setMaterials={setMaterials}
            />
          )}
        </div>
      )}
    </>
  );
}

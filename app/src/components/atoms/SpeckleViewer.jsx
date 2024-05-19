import Controls from "./ControlsComponent";
import { useViewer } from "../../context/viewer";
import { useState } from "react";
import { RenderPopup } from "./RenderPopup";
export default function SpeckleViewer() {
  const viewer = useViewer();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  return (
    <>
      <div
        id="renderer"
        style={{
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
          <Controls togglePopup={togglePopup} />
          {isPopupOpen && <RenderPopup togglePopup={togglePopup} />}
        </div>
      )}
    </>
  );
}

import { Button, Typography } from "antd";
import { Spin } from "antd";
import { AI_API_URL } from "App";
import React, { useEffect, useState } from "react";

export function RenderPopup({ togglePopup, render, setRender, setMaterials }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!render) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [render]);
  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  const materialSetter = (materialsObject) => {
    const materialsList = [];
    // Iterate over each category (ceiling, floor, wall)
    Object.keys(materialsObject).forEach((category) => {
      materialsObject[category].forEach((texture) => {
        // Extracting values from the texture object
        const { thumbnail, color, name } = texture;
        const [r, g, b] = color.replace(/[()]/g, "").split(",");
        const colorHex = rgbToHex(parseInt(r), parseInt(g), parseInt(b));
        // Creating a new texture object with desired format
        const textureMaterial = {
          materialName: name.split(".")[0].split("_").join(" "),
          thumbnail: thumbnail,
          link: `https://polyhaven.com/a/${name.split(".")[0]}`,
          material: {
            color: colorHex,
            opacity: 1,
            roughness: 1,
            metalness: 0,
            vertexColors: false,
          },
        };

        // Pushing the texture material to the materials array
        materialsList.push(textureMaterial);
      });
    });
    setMaterials(materialsList);
  };
  return (
    <div style={styles.popupOverlay}>
      {loading ? (
        <Spin />
      ) : (
        <div style={styles.popupContent}>
          <img src={render} alt="Placeholder" style={styles.image} />
          <div style={styles.buttonGroup}>
            <Button
              type="text"
              disabled={!render}
              onClick={async () => {
                setLoading(true);
                // hit end point and set materials
                try {
                  const formData = new FormData();

                  // Convert the image to a Blob
                  const blob = new Blob([render], { type: "image/png" });

                  // Append the image Blob to the FormData object
                  formData.append("image", blob, "render.png");
                  const response = await fetch(`${AI_API_URL}/image-analyzer`, {
                    method: "POST",
                    headers: {
                      accept: "application/json",
                      "Access-Control-Allow-Origin": "*",
                      // 'Content-Type' is automatically set to 'multipart/form-data' when using FormData
                    },

                    body: formData,
                  });
                  const result = await response.json();
                  materialSetter(result);
                  togglePopup();
                  setRender(null);
                  setLoading(false);
                } catch (error) {
                  console.error("Error:", error);
                }
              }}
            >
              <Typography.Title level={5} style={{ margin: 0, color: "white" }}>
                Continue
              </Typography.Title>
            </Button>
            <Button
              type="text"
              onClick={() => {
                togglePopup();
                setRender(null);
              }}
            >
              <Typography.Title level={5} style={{ margin: 0, color: "white" }}>
                Reprompt
              </Typography.Title>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  app: {
    textAlign: "center",
    marginTop: "50px",
  },
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  popupContent: {
    background: "#001529",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
  },
  buttonGroup: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-around",
  },
  button: {
    margin: "0 10px",
  },
  image: {
    maxHeight: "70vh",
    maxWidth: "80vw",
    width: "auto",
  },
};

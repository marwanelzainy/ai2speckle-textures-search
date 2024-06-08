import { Button, Typography } from "antd";
import { Spin } from "antd";

export function RenderPopup({ togglePopup, render, setRender }) {
  return (
    <div style={styles.popupOverlay}>
      <div style={styles.popupContent}>
        {render ? (
          <img
            src={`data:image/png;base64,${render}`}
            alt="Placeholder"
            style={styles.image}
          />
        ) : (
          <Spin />
        )}
        <div style={styles.buttonGroup}>
          <Button
            type="text"
            onClick={async () => {
              // hit end point and set materials
              try {
                const response = await fetch(
                  "http://127.0.0.1:8000/image-render?prompt=",
                  {
                    method: "POST",
                    headers: {
                      accept: "application/json",
                      // 'Content-Type' is automatically set to 'multipart/form-data' when using FormData
                    },
                    mode: "cors", // CORS mode
                    credentials: "same-origin",
                    body: "",
                  }
                );
                const result = await response.json();
                console.log("Success:", result);
                setRender(result.image);
              } catch (error) {
                console.error("Error:", error);
              }
            }}
            disabled={!render}
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

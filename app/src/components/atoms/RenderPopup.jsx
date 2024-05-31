import { Button, Typography } from "antd";

export function RenderPopup({ togglePopup, render }) {
  return (
    <div style={styles.popupOverlay}>
      <div style={styles.popupContent}>
        <img src={render} alt="Placeholder" style={styles.image} />
        <div style={styles.buttonGroup}>
          <Button
            type="text"
            onClick={() => {
              // hit end point and set materials
              alert("Button 1 clicked");
            }}
          >
            <Typography.Title level={5} style={{ margin: 0, color: "white" }}>
              Continue
            </Typography.Title>
          </Button>
          <Button
            type="text"
            onClick={() => {
              // fetch and then set render
              alert("Button 2 clicked");
            }}
          >
            <Typography.Title level={5} style={{ margin: 0, color: "white" }}>
              Rerender
            </Typography.Title>
          </Button>
          <Button type="text" onClick={togglePopup}>
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

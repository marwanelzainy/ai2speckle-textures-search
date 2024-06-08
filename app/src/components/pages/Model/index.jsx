import React from "react";
import { useLocation } from "react-router-dom";

import { ViewerProvider } from "../../../context/viewer";
import SpeckleViewer from "../../atoms/SpeckleViewer";

const Model = () => {
  const location = useLocation();
  const { modelLink } = location.state || {};
  return (
    <ViewerProvider modelLink={modelLink}>
      <SpeckleViewer />
    </ViewerProvider>
  );
};

export default Model;

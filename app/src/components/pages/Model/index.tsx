import React, { useEffect } from "react";
import { Card, List, Space, Typography } from "antd";
import { BranchesOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

import { useStreams } from "hooks/useStreams";
import PageColumn from "components/templates/PageColumn";
import SpeckleViewer from "components/atoms/SpeckleViewer";
import { ViewerProvider } from "context/viewer";

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

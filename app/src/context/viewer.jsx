import { createContext, useEffect, useState, useContext } from "react";
import {
  Viewer,
  DefaultViewerParams,
  SpeckleLoader,
  CameraController,
  SelectionExtension,
} from "@speckle/viewer";
import { useAuth } from "./auth";

const ViewerContext = createContext();

export function ViewerProvider({ modelLink, children }) {
  const { token } = useAuth();
  const [viewer, setViewer] = useState();
  useEffect(() => {
    async function main() {
      /** Get the HTML container */
      const container = document.getElementById("renderer");
      /** Configure the viewer params */
      const params = DefaultViewerParams;
      params.verbose = true;
      /** Create Viewer instance */
      const viewer = new Viewer(container, params);

      /** Get the HTML container */
      await viewer.init();

      /** Add the stock camera controller extension */
      viewer.createExtension(CameraController);
      /** Add the selection extension for extra interactivity */
      const selector = viewer.createExtension(SelectionExtension);

      /** Create a loader for the speckle stream */
      const loader = new SpeckleLoader(viewer.getWorldTree(), modelLink, token);
      /** Load the speckle data */
      await viewer.loadObject(loader, true);
      setViewer(viewer);
    }
    main();
  }, []);

  return (
    <ViewerContext.Provider value={viewer}>{children}</ViewerContext.Provider>
  );
}

export function useViewer() {
  return useContext(ViewerContext);
}

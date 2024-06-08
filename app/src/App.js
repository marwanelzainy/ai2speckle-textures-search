import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { AuthProvider } from "context/auth";
import { GraphqlProvider } from "context/graphql";
import { UserProvider } from "context/user";

import AuthCallback from "./components/pages/AuthCallback";
import Index from "./components/pages/Index";
import StreamList from "./components/pages/StreamList";
import Root from "./components/templates/Root";
import Model from "./components/pages/Model";

export const AI_API_URL =
  process.env.REACT_APP_AI_API_URL ?? "http://127.0.0.1:8000";
const App = () => {
  return (
    <AuthProvider>
      <GraphqlProvider>
        <UserProvider>
          <RouterProvider
            router={createBrowserRouter(
              createRoutesFromElements(
                <Route path="" element={<Root appName="Speckle Hackathon" />}>
                  <Route index element={<Index />} />
                  <Route path="auth" element={<AuthCallback />} />
                  <Route path="streams" element={<StreamList />} />
                  <Route path="model" element={<Model />} />
                </Route>
              )
            )}
          />
        </UserProvider>
      </GraphqlProvider>
    </AuthProvider>
  );
};

export default App;

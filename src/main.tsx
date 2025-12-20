import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import Levels from "./pages/Levels";
import TypePage from "./pages/TypePage";
import ImeTest from "./pages/ImeTest";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Levels />,
      },
      {
        path: "/type/:id",
        element: <TypePage />,
      },
      {
        path: "/ime-test",
        element: <ImeTest />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider
      defaultColorScheme="dark"
      theme={{
        components: {
          Modal: { defaultProps: { zIndex: 500 } },
          Notification: { defaultProps: { zIndex: 600 } },
        },
      }}
    >
      <ModalsProvider>
        <Notifications />
        <RouterProvider router={router} />
      </ModalsProvider>
    </MantineProvider>
  </React.StrictMode>
);

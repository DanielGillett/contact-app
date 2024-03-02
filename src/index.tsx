import "./index.css";
import React from "react";
import App from "./App";
import ReactDOM from "react-dom/client";
import { Root } from "./components/Root";
import { Hero } from "./components/Hero";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import { ContactAdd } from "./components/ContactAdd";
import { ContactEdit } from "./components/ContactEdit";
import { ContactDetails } from "./components/ContactDetails";
import { ContactProvider } from "./components/ContactContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        path: "contacts",
        element: <Hero />,
      },
      {
        path: "contacts/new",
        element: <ContactAdd />,
      },
      {
        path: "contacts/:id/edit",
        element: <ContactEdit />,
      },
      {
        path: "contacts/:id",
        element: <ContactDetails />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <AuthProvider>
        <ContactProvider>
          <RouterProvider router={router} />
        </ContactProvider>
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

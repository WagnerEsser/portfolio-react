import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "antd/dist/reset.css"; // reset global recommended on v5
import "./base.css";
import App from "./App";
import ptBR from "antd/locale/pt_BR";
import { ConfigProvider, theme } from "antd";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider
      locale={ptBR}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: { colorPrimary: "#7c3aed" },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>
);

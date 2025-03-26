import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "./contexts/UserContext.jsx";
import { NotificationProvider } from "./contexts/NotificationContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <NotificationProvider>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </NotificationProvider>
  </BrowserRouter>
);

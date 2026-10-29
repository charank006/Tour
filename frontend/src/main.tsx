import { createRoot } from "react-dom/client";
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/fraunces';
import '@fontsource/caveat';
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

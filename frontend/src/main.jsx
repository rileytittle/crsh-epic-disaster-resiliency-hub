import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import 'react-tooltip/dist/react-tooltip.css';
import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap/dist/js/bootstrap.bundle.js';
//require('dotenv').config();

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<App />
	</StrictMode>
);

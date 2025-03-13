import React from "react";
import "./index.scss";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.jsx";
import { PermissionProvider } from "./contexts";


ReactDOM.createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<PermissionProvider>
			<App />
		</PermissionProvider>
	</Provider>
);

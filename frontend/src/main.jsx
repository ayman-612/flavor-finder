import React from "react";
import ReactDOM from "react-dom/client";
import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import Spotify from "./pages/Spotify/Spotify.jsx";
import Setup from "./pages/Setup/Setup.jsx";
import SavedRecipes from "./pages/SavedRecipes/SavedRecipes.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

const router = createBrowserRouter([
	{
		path: "/",
		element: <LandingPage />,
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/home",
		element: <Home />,
	},
	{
		path: "/spotify",
		element: <Spotify />,
	},
	{
		path: "/setup",
		element: <Setup />,
	},
	{
		path: "/saved-recipes",
		element: <SavedRecipes />,
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<GoogleOAuthProvider clientId="710084781468-qrkj9vvjjs88f74djpr8rln0tcr2k49p.apps.googleusercontent.com">
			<RouterProvider router={router} />
		</GoogleOAuthProvider>
	</React.StrictMode>
);

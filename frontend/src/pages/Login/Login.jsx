import spotify from "../../assets/spotify.png";
import detective from "../../assets/detective.png";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { GoogleLogin } from "@react-oauth/google";

import jwt_decode from "jwt-decode";

const Login = () => {
	const navigate = useNavigate();
	useEffect(() => {
		if (localStorage.getItem("email")) {
			navigate("/home");
		}
	}, [navigate]);

	const anon = () => {
		localStorage.setItem("email", "anonymous");
		navigate("/home");
	};

	return (
		<div className="login">
			<div className="login-options">
				<button className="spotify" onClick={() => window.location.assign("https://accounts.spotify.com/authorize?response_type=token&client_id=30cfb401e105418ea05a5a46144de805&scope=user-read-private%20user-read-email&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fspotify")}>
					<img src={spotify} alt="Spotify" />
				</button>
				<button className="anonymous" onClick={anon}>
					<img src={detective} alt="anonymous" />
				</button>
				<GoogleLogin
					size="large"
					shape="rectangular"
					logo_alignment="center"
					onSuccess={(res) => {
						const userObject = jwt_decode(res.credential);
						localStorage.setItem("email", userObject.email);
						navigate("/home");
					}}
					onError={() => {
						console.log("Login Failed");
					}}
				/>
			</div>
		</div>
	);
};

export default Login;

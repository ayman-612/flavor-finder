import { useLocation, useNavigate } from "react-router-dom";
import querystring from "query-string";
import { useEffect } from "react";

const Spotify = () => {
	const navigate = useNavigate();
	const hash = useLocation().hash;
	useEffect(() => {
		if (window.location.hash.substring(1).split("&")[0].split("=")[0] === "access_token") {
			const getData = async () => {
				const token = querystring.parse(hash.substring(1)).access_token;
				const result = await fetch("https://api.spotify.com/v1/me", {
					method: "GET",
					headers: { Authorization: `Bearer ${token}` },
				});

				return await result.json();
			};
			getData().then((data) => {
				localStorage.setItem("email", data.email);
				navigate("/home");
			});
		} else navigate("/login");
	});

	return <div></div>;
};

export default Spotify;

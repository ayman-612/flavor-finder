import "./Setup.css";
import { useNavigate } from "react-router-dom";
import go from "../../assets/go.png";
import axios from "axios";
import { useEffect, useState } from "react";

const Setup = () => {
	const navigate = useNavigate();
	let email = localStorage.getItem("email");
	if (!email) {
		navigate("/login");
	}
	if (email === "anonymous") navigate("/home");

	useEffect(() => {
		axios.get("http://localhost:3000/api/account/" + email).then((res) => {
			if (res.data.error) return;
			setVeg(res.data.veg);
			setPreferences(res.data.preferences);
		});
	}, []);
	const submit = () => {
		axios
			.post("http://localhost:3000/api/account/" + email, {
				veg,
				preferences: document.querySelector("textarea").value,
			})
			.then(() => {
				navigate("/home");
			});
		// navigate("/home");
	};
	const [veg, setVeg] = useState(true);
	const [preferences, setPreferences] = useState("");
	return (
		<div className="setup">
			<h1>Setup</h1>
			<div className="setup-options">
				<form>
					<div className="checkbox">
						<p>Are you vegetarian?</p>
						<input className="tgl tgl-flip" id="visible" checked={veg} type="checkbox" onChange={(e) => setVeg(e.target.checked)} />
						<label className="tgl-btn" htmlFor="visible" data-tg-off="Nope." data-tg-on="Yeah!"></label>
					</div>
					<div>
						<p>Preferences</p>
						<textarea value={preferences} onChange={(e) => setPreferences(e.target.value)} placeholder="I don't like broccoli" />
					</div>
					<button type="button" className="button" onClick={submit}>
						<img src={go} alt="" />
					</button>
				</form>
			</div>
		</div>
	);
};

export default Setup;

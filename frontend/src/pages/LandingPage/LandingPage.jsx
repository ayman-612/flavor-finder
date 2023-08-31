import "./LandingPage.css";
import landing from "../../assets/landing.png";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
	const navigate = useNavigate();

	return (
		<>
			<div className="logo">
				<img src={logo} alt="flavor finder" />
			</div>
			<div className="landing-page">
				<p className="heading">Kitchen wizardry made simple.</p>
				<img src={landing} alt="landing-image" />
			</div>
			<button className="button login" onClick={() => navigate("/login")}>
				Get Started
			</button>
		</>
	);
};

export default LandingPage;

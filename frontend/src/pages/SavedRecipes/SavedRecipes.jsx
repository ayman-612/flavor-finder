import "./SavedRecipes.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import go from "../../assets/go.png";

const SavedRecipes = () => {
	const navigate = useNavigate();

	const [recipes, setRecipes] = useState([]);

	useEffect(() => {
		let email = localStorage.getItem("email");
		if (!email) {
			navigate("/login");
		}
		if (email === "anonymous") navigate("/home");

		axios.get("http://localhost:3000/api/account/" + email).then((res) => {
			if (res.data.error) return;
			setRecipes(res.data.savedRecipes);
		});
	}, [navigate]);
	if (recipes?.length)
		return (
			<div className="saved recipes">
				<h1>Saved recipes</h1>
				{recipes.map((recipe, idx) => (
					<div className="recipe" key={idx}>
						<div className="text">
							<h3>{recipe.title}</h3>

							<ul>
								{recipe.instructions.map((instruction, iidx) => (
									<li className="instruction" key={iidx}>
										{instruction}
									</li>
								))}
							</ul>
						</div>
						<div className="image">
							<img src={recipe.image} alt="" />
						</div>
					</div>
				))}{" "}
				<button className="button go back" onClick={() => navigate("/home")}>
					<img src={go} alt="go back" />
				</button>
			</div>
		);
	else return "No saved recipes";
};

export default SavedRecipes;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";
import IngredientList from "../../components/IngredientList/IngredientList";
import logo from "../../assets/logo.png";
import blender from "../../assets/blender.png";
import microwave from "../../assets/microwave.png";
import oven from "../../assets/oven.png";
import stove from "../../assets/stove.png";
import pot from "../../assets/pot.png";
import vegSign from "../../assets/veg.png";
import go from "../../assets/go.png";
import logoutIcon from "../../assets/logout.png";
import settings from "../../assets/settings.png";
import bookmark from "../../assets/bookmark.png";
import { googleLogout } from "@react-oauth/google";

function App() {
	const navigate = useNavigate();
	useEffect(() => {
		if (!localStorage.getItem("email")) {
			navigate("/login");
		}
		if (localStorage.getItem("email") === "anonymous") {
			return;
		}
		axios
			.get("http://localhost:3000/api/account/" + localStorage.getItem("email"))
			.then((res) => {
				if (res.data.error) return alert(res.data.error);
				setVeg(res.data.veg);
				setAnon(false);
				setPrefs(res.data.preferences);
			})
			.catch((err) => {
				if (err.response.status === 404) navigate("/setup");
			});
	}, [navigate]);
	const [equipment, setEquipment] = useState({
		blender: false,
		microwave: false,
		oven: false,
		stove: false,
	});
	const [veg, setVeg] = useState(true);
	const [ingredients, setIngredients] = useState([""]);
	const [recipes, setRecipes] = useState([]);
	const [loading, setLoading] = useState(false);
	const [prefs, setPrefs] = useState("");
	const [anon, setAnon] = useState(true);
	const [qty, setQty] = useState(3);
	const [cuisine, setCuisine] = useState("any");

	const submit = () => {
		if (ingredients.length === 1 && ingredients[0] === "") return alert("Please enter at least one ingredient");
		if (!equipment.blender && !equipment.microwave && !equipment.oven && !equipment.stove) return alert("Please select at least one piece of equipment");
		setLoading(true);
		axios
			.post("http://localhost:3000/api/recipe/", {
				ingredients: ingredients,
				equipment: equipment,
				vegetarian: veg,
				preferences: prefs,
				cuisine,
				qty,
			})
			.then((res) => {
				setLoading(false);
				if (res.data.error) return alert(res.data.error);
				if (res.data.recipes) setRecipes(res.data.recipes);
				else setRecipes(res.data);
			});
	};

	const reset = () => {
		setRecipes([]);
	};

	const logout = () => {
		window.localStorage.clear();
		googleLogout();
		navigate("/login");
	};

	const bookmarkRecipe = (idx) => {
		axios
			.post("http://localhost:3000/api/account/bookmark", {
				email: localStorage.getItem("email"),
				recipe: recipes[idx],
			})
			.then((res) => {
				if (res.data.error) return alert(res.data.error);
				setRecipes(
					recipes.map((recipe, index) => {
						if (index === idx) return { ...recipe, bookmarked: true };
						return recipe;
					})
				);
			});
	};

	const form = () => {
		return (
			<div className="form">
				<div className="selector ">
					<img className="selector-icon" src={pot} alt="" />
					<div onClick={() => setEquipment({ ...equipment, blender: !equipment.blender })} className={equipment.blender ? "selector-item selected" : "selector-item"}>
						<img src={blender} alt="blender" />
					</div>
					<div onClick={() => setEquipment({ ...equipment, microwave: !equipment.microwave })} className={equipment.microwave ? "selector-item selected" : "selector-item"}>
						<img src={microwave} alt="microwave" />
					</div>
					<div onClick={() => setEquipment({ ...equipment, oven: !equipment.oven })} className={equipment.oven ? "selector-item selected" : "selector-item"}>
						<img src={oven} alt="oven" />
					</div>
					<div onClick={() => setEquipment({ ...equipment, stove: !equipment.stove })} className={equipment.stove ? "selector-item selected" : "selector-item"}>
						<img src={stove} alt="stove" />
					</div>
				</div>
				<div className="selector qty">
					{/* <img className="selector-icon" src={pot} alt="" /> */}
					<p className="selector-icon selector-qty">{qty}</p>
					<div onClick={() => setQty(1)} className={qty === 1 ? "selector-item selected" : "selector-item"}>
						<div className="qty-button">1</div>
					</div>
					<div onClick={() => setQty(2)} className={qty === 2 ? "selector-item selected" : "selector-item"}>
						<div className="qty-button">2</div>
					</div>
					<div onClick={() => setQty(3)} className={qty === 3 ? "selector-item selected" : "selector-item"}>
						<div className="qty-button">3</div>
					</div>
				</div>
				<div className="veg-selector">
					<img onClick={() => setVeg(!veg)} className={veg ? "veg" : "non-veg"} src={vegSign} />
				</div>

				<button className="button go" onClick={() => submit()}>
					{loading ? <div className="loader-wheel"></div> : null}
					<img src={go} alt="go" />
				</button>
				<button className="button logout" onClick={() => logout()}>
					<img src={logoutIcon} alt="logout" />
				</button>
				{anon ? null : (
					<button className="button saved-recipes" onClick={() => navigate("/saved-recipes")}>
						<img src={bookmark} alt="saved recipes" />
					</button>
				)}

				<div className="cuisine-selector">
					<button className={cuisine === "any" ? "selected" : ""} onClick={() => setCuisine("any")}>
						Any
					</button>
					<button className={cuisine === "italian" ? "selected" : ""} onClick={() => setCuisine("italian")}>
						Italian
					</button>
					<button className={cuisine === "indian" ? "selected" : ""} onClick={() => setCuisine("indian")}>
						Indian
					</button>
					<button className={cuisine === "chinese" ? "selected" : ""} onClick={() => setCuisine("chinese")}>
						Chinese
					</button>
					<button className={cuisine === "mexican" ? "selected" : ""} onClick={() => setCuisine("mexican")}>
						Mexican
					</button>
					<button className={cuisine === "thai" ? "selected" : ""} onClick={() => setCuisine("thai")}>
						Thai
					</button>
				</div>
				{anon ? null : (
					<button className="button settings" onClick={() => navigate("/setup")}>
						<img src={settings} alt="settings" />
					</button>
				)}
				{loading ? <p className="loading-message">Note, requests may take a while to appear due to scarcity of computational resources</p> : null}

				<h1 className="recipe-heading">I have:</h1>
				<IngredientList ingredients={ingredients} setIngredients={setIngredients} />
			</div>
		);
	};

	const recipeDisplay = () => {
		return (
			<div className="recipes">
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
							{anon || recipe.bookmarked ? null : <img className="bookmark" onClick={() => bookmarkRecipe(idx)} src={bookmark} />}
						</div>
						<div className="image">
							<img src={recipe.image} alt="" />
						</div>
					</div>
				))}{" "}
				<button className="button go back" onClick={() => reset()}>
					<img src={go} alt="go back" />
				</button>
			</div>
		);
	};
	return (
		<div>
			<nav>
				<div className="logo">
					<img src={logo} alt="flavor finder" />
				</div>
			</nav>
			{recipes?.length === 0 ? form() : recipeDisplay()}
		</div>
	);
}

export default App;

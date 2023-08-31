import { useRef } from "react";
import "./IngredientList.css";
const examples = ["Salt", "Pepper", "Olive oil", "Garlic", "Onion", "Butter", "Flour", "Sugar", "Eggs", "Milk", "Rice", "Pasta", "Canned tomatoes", "Baking powder", "Baking soda", "Vinegar", "Soy sauce", "Honey", "Oats", "Cinnamon"];

const IngredientList = ({ ingredients, setIngredients }) => {
	const inputRefs = useRef([]); // Ref to store references to input elements

	const handleKeyPress = (index, event) => {
		if (event.key === "Enter" && ingredients[index] !== "") {
			event.preventDefault();
			addIngredient(index);
		}
	};

	const addIngredient = (index) => {
		const newIngredients = [...ingredients];
		newIngredients.splice(index + 1, 0, ""); // Insert an empty string at the specified index
		setIngredients(newIngredients);

		// Move focus to the newly added textbox
		setTimeout(() => {
			inputRefs.current[index + 1].focus();
		}, 0);
	};

	const updateIngredients = (index, value) => {
		const newIngredients = [...ingredients];
		newIngredients[index] = value;
		setIngredients(newIngredients);
	};

	return (
		<div className="ingredient-list">
			{ingredients.map((value, index) => (
				<input autoFocus placeholder={examples[Math.floor(Math.random() * 20)]} key={index} ref={(el) => (inputRefs.current[index] = el)} value={value} onChange={(e) => updateIngredients(index, e.target.value)} onKeyPress={(e) => handleKeyPress(index, e)} className="ingredient" />
			))}
		</div>
	);
};

export default IngredientList;

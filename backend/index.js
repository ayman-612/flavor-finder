const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const google = require("googlethis");

const mongoose = require("mongoose");
var cors = require("cors");
const app = express();
const port = 3000;
require("dotenv").config();
const Schema = mongoose.Schema;

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

mongoose.connect(process.env.MONGO_URI);
const account = new Schema({
	email: String,
	savedRecipes: Array,
	preferences: String,
	veg: Boolean,
});

const Account = mongoose.model("Account", account);

app.use(cors());
app.use(express.json());

app.post("/api/recipe/", async (req, res) => {
	// return console.log(req.body);
	const messages = [
		{
			role: "system",
			content: `You are a cooking copilot, who analyzes available resources, and suggests ${req.body.qty} of the best recipes that can be made with them. Your input will be a JSON object of the user's request, and your output will be a JSON-formatted array of three recipes. Note that your output HAS to be in json format, and instructions must be an array. Eg. [{title: "pizza" instructions: ["1. apply sauce to base", "2. grate cheese on top"]}, ...]. If you can't think of any good recipes, or anything else goes wrong, please describe the problem in under 50 words, starting with 'error'.`,
		},
		{
			role: "user",
			content: JSON.stringify({
				ingredients: req.body.ingredients.join(", "),
				preferences: req.body.preferences.length ? req.body.preferences : undefined,
				vegetarian: req.body.veg,
				cuisine: req.body.cuisine,
				equipment: Object.keys(req.body.equipment)
					.filter((key) => req.body.equipment[key])
					.join(", "),
			}),
		},
	];
	openai
		.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: messages,
		})
		.then((completion) => {
			try {
				// console.log(completion.data.choices[0].message.content);
				let output = JSON.parse(completion.data.choices[0].message.content);
				(async () => {
					for (let i = 0; i < output.length; i++) {
						const images = await google.image(output[i].title, { safe: true });
						output[i].image = images[0].url;
						if (i === output.length - 1) res.json(output);
					}
				})();
			} catch (e) {
				return res.json({ error: "no recipes found" });
			}
		})
		.catch((err) => {
			return res.json({ error: "something went wrong" });
		});

	// sample output for testing:
	// res.json({
	// 	recipes: [
	// 		{
	// 			title: "Aloo Gobi",
	// 			instructions: ["1. Heat oil in a pan and add chopped onions.", "2. Add diced potatoes and cook for 5 minutes.", "3. Add cauliflower and cook for another 5 minutes.", "4. Add peas, chopped tomatoes, and spices.", "5. Cook for an additional 10-15 minutes until vegetables are tender. Serve with rice."],
	// 		},
	// 		{
	// 			title: "Microwave Saag Paneer",
	// 			instructions: ["1. Puree spinach and onions in a blender.", "2. Microwave spinach mixture for 8-10 minutes until fully cooked.", "3. Add cubed paneer, spices, and a splash of heavy cream.", "4. Microwave for an additional 1-2 minutes or until cheese is melted.", "5. Serve hot over rice."],
	// 		},
	// 		{
	// 			title: "Oven Roasted Tamatar Chawal",
	// 			instructions: ["1. Preheat oven to 375°F.", "2. Combine rice, chopped tomatoes, and spices in a baking dish.", "3. Add enough water to cover the rice and stir.", "4. Cover with foil and bake for 45-50 minutes or until rice is fully cooked.", "5. Serve hot."],
	// 		},
	// 	],
	// });
});

app.get("/api/account/:email", async (req, res) => {
	const email = req.params.email;
	if (!email) return res.status(404).json({ error: "no account found" });
	Account.findOne({ email: email }).then((account) => {
		if (account) {
			res.json(account);
		} else {
			res.status(404).json({ error: "no account found" });
		}
	});
});
app.post("/api/account/bookmark", async (req, res) => {
	const { email, recipe } = req.body;
	Account.findOne({ email }).then((account) => {
		if (!account) return res.status(404).json({ error: "no account found" });
		account.savedRecipes.push(recipe);
		account
			.save()
			.then((account) => {
				res.json(account);
			})
			.catch((err) => res.status(500).json({ error: "error saving account" }));
	});
});

app.post("/api/account/:email", async (req, res) => {
	const { preferences, veg } = req.body;
	const email = req.params.email;
	Account.findOne({ email }).then((account) => {
		if (!account) {
			account = new Account({ email });
		}
		account.preferences = preferences;
		account.veg = veg;
		account
			.save()
			.then((account) => {
				res.json(account);
			})
			.catch((err) => res.status(500).json({ error: "error saving account" }));
	});
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

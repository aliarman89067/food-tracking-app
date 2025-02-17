import mongoose from "mongoose";

const cuisineSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  name: { type: String, required: true, minLength: 4, maxLength: 300 },
  foods: [{ type: mongoose.Schema.Types.ObjectId, ref: "Food" }],
});

const Cuisine = mongoose.model("Cuisine", cuisineSchema);
export default Cuisine;

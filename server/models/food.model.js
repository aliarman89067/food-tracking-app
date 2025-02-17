import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  name: { type: String, required: true, minLength: 1, maxLength: 300 },
});

const Food = mongoose.model("Food", foodSchema);
export default Food;

import Cuisine from "../models/cuisine.model.js";
import Food from "../models/food.model.js";

export const getAllCuisines = async (req, res) => {
  try {
    const cuisinesData = await Cuisine.find();
    res.status(200).json({ success: true, data: cuisinesData });
  } catch (error) {
    console.log(error);
  }
};

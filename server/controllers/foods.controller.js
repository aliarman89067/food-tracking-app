import Cuisine from "../models/cuisine.model.js";
import Food from "../models/food.model.js";

export const getAllFoods = async (req, res) => {
  try {
    const getFoods = await Cuisine.findById(req.params.id)
      .select("foods")
      .populate("foods");
    if (!getFoods) {
      return res
        .status(404)
        .json({ success: false, message: "No foods found!" });
    }
    res.status(200).json({ success: true, data: getFoods });
  } catch (error) {
    console.log(error);
  }
};

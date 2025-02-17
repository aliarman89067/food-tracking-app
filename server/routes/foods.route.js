import { Router } from "express";
import { getAllFoods } from "../controllers/foods.controller.js";

const foodsRouter = Router();

foodsRouter.get("/:id", getAllFoods);

export default foodsRouter;

import { Router } from "express";
import { getAllCuisines } from "../controllers/cuisines.controller.js";

const cuisinesRouter = Router();

cuisinesRouter.get("/", getAllCuisines);

export default cuisinesRouter;

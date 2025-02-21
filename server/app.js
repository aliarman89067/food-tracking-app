import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cuisinesRouter from "./routes/cuisines.route.js";
import foodsRouter from "./routes/foods.route.js";

const app = express();

app.use(express.json());
app.use("/api/v1/cuisines", cuisinesRouter);
app.use("/api/v1/foods", foodsRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  });
});

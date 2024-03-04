import express from "express";
import food from "../controllers/foodCntroller.js";

const routes = express.Router()

routes.get("/products/:nutrition/:nova", food.findAll);
routes.get("/product/:id/:search_value", food.findOne);


export { routes as default };
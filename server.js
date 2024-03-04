import routes from "./routes/foodRoute.js";
import swaggerFile from './swagger-output.json' assert { type: "json" }
import express from "express";
import swaggerUi from 'swagger-ui-express';

const app = express();

app.use(express.json());
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use(routes);

app.listen(3000, () => console.log("Servidor iniciado na porta 3000"));
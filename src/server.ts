import express from "express";
import cors from "cors";
import foodRouter from "./routers/foods.router";
import userRouter from "./routers/users.router";
import orderRouter from "./routers/order.router";
import dotenv from "dotenv";
dotenv.config();
import { dbConnect } from "./configs/database.config";
dbConnect();

const app = express();
const port = process.env.PORT || 5000;

//* Middlewares
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:4200",
  })
);
app.use(express.json());
app.use("/api", foodRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

/* //*-----------------------------------------------------------------------------------
                                    GET
--------------------------------------------------------------------------------------- */

app.get("/", (req, res) => {
  res.send("Hello World!");
});

/* //*-----------------------------------------------------------------------------------
                                    POST
--------------------------------------------------------------------------------------- */

app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});

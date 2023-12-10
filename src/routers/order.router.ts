import { Router } from "express";
import asyncHandler from "express-async-handler";
import { orderModel } from "../models/order.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import auth from "../middlewares/auth.mid";
import { OrderStatus } from "../constants/order_status";

const router = Router();
router.use(auth);

router.post(
  "/create",
  asyncHandler(async (req: any, res: any) => {
    const orderRequest = req.body;
    if (req.decoded.id !== orderRequest.id) {
      // verifying the real user
      res.status(403).send({ error: true, message: "unauthorized access" });
      return;
    }
    if (req.decoded?.isAdmin !== false) {
      return res.status(403).send({ error: true, message: "forbidden access" });
    }

    if (orderRequest.items.length <= 0) {
      res.status(HTTP_BAD_REQUEST).send("Cart is empty!!!");
      return;
    }
    await orderModel.deleteOne({
      user: req.decoded.id,
      status: OrderStatus.NEW,
    });

    /* const newOrder = new orderModel({ ...orderRequest, user: req.decoded.id });
    await newOrder.save(); */
    const newOrder = await orderModel.create({ ...orderRequest, user: req.decoded.id });
    res.send(newOrder);
  })
);

export default router;

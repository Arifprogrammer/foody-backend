import { Router } from "express";
import { foods } from "../data";
import { FoodModel } from "../models/food.model";
import asyncHandler from "express-async-handler";

const router = Router();

/* //*-----------------------------------------------------------------------------------
                                    SEED
--------------------------------------------------------------------------------------- */
router.get(
  "/foods/seed",
  asyncHandler(async (req, res) => {
    const foodsCount = await FoodModel.countDocuments();
    if (foodsCount > 0) {
      res.send("Seed is already done!");
      return;
    }

    await FoodModel.create(foods);
    res.send("Seed Is Done!");
  })
);
/* //*-----------------------------------------------------------------------------------
                                    GET
--------------------------------------------------------------------------------------- */

router.get(
  "/foods",
  asyncHandler(async (req, res) => {
    const foods = await FoodModel.find();
    res.send(foods);
  })
);

router.get(
  "/foods/search/:name",
  asyncHandler(async (req, res) => {
    const searchedName = new RegExp(req.params.name, "i");
    const food = await FoodModel.find({ name: { $regex: searchedName } });
    res.send(food);
  })
);

router.get(
  "/food/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const food = await FoodModel.findById(id);
    res.send(food);
  })
);

router.get(
  "/foods/tags",
  asyncHandler(async (req, res) => {
    const tags = await FoodModel.aggregate([
      {
        $unwind: "$tags",
      },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          count: "$count",
        },
      },
    ]).sort({ count: -1 });

    const all = {
      name: "All",
      count: await FoodModel.countDocuments(),
    };

    tags.unshift(all);
    res.send(tags);
  })
);

router.get(
  "/foods/tags/:tag",
  asyncHandler(async (req, res) => {
    const tag = req.params.tag;
    const food = await FoodModel.find({ tags: tag });
    res.send(food);
  })
);

/* //*-----------------------------------------------------------------------------------
                                    Patch
--------------------------------------------------------------------------------------- */
router.patch(
  "/food/:id/favorite",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const favorite = req.body.favorite;
    const updatedFood = await FoodModel.findOneAndUpdate(
      { _id: id },
      { favorite: favorite },
      { new: true }
    );
    if (!updatedFood) {
      res.status(404).send({ message: "Food not found" });
      return;
    }
    res.send(updatedFood);
  })
);

export default router;

import * as express from "express"
import { Request, Response, NextFunction } from "express"
import { getRepository } from "typeorm"
import { Burger } from "../entity/Burger"
import { BurgerService } from "../services/burgerService"
import { RestaurantService } from "../services/restaurantService"
import HttpStatus from "http-status-codes"

const router = express.Router()

router.get("/", async (_req: Request, res: Response) => {
  const burgerService = new BurgerService()
  const burgers = await burgerService.getAll()
  return res.json(burgers)
})

router.get("/:id", async (req: Request, res: Response) => {
  const burgerRepository = getRepository(Burger)
  const results = await burgerRepository.findOne(req.params.id)
  return res.send(results)
})

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const burgerService = new BurgerService()
  const restaurantService = new RestaurantService()

  const restaurant = await restaurantService.getByName(req.body.restaurant)

  if (!restaurant) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: "Restaurant not found or the field is missing" })
  }

  const burger = {
    ...req.body,
    date: new Date(),
    restaurant: restaurant,
  }

  const newBurger = await burgerService.instantiate(burger)

  try {
    const response = await burgerService.add(newBurger)
    return res.status(HttpStatus.OK).json({ ...response })
  } catch (error) {
    return next(error)
  }
})

router.put("/:id", async (req: Request, res: Response) => {
  const burgerRepository = getRepository(Burger)
  const restaurant = await burgerRepository.findOne(req.params.id)
  burgerRepository.merge(restaurant, req.body)
  const results = await burgerRepository.save(Burger)
  return res.send(results)
})

router.delete("/:id", async (req: Request, res: Response) => {
  const burgerRepository = getRepository(Burger)
  const results = await burgerRepository.delete(req.params.id)
  return res.send(results)
})

export default router

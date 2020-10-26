import * as express from "express"
import { Request, Response } from "express"
import { getRepository } from "typeorm"
import { Restaurant } from "../entity/Restaurant"

const router = express.Router()

router.get("/", async (_req: Request, res: Response) => {
  const restaurantRepository = getRepository(Restaurant)
  const restaurants = await restaurantRepository.find()
  res.json(restaurants)
})

router.get("/:id", async (req: Request, res: Response) => {
  const restaurantRepository = getRepository(Restaurant)
  const results = await restaurantRepository.findOne(req.params.id)
  return res.send(results)
})

router.post("/", async (req: Request, res: Response) => {
  const restaurantRepository = getRepository(Restaurant)
  const restaurant = await restaurantRepository.create(req.body)
  const results = await restaurantRepository.save(restaurant)
  return res.send(results)
})

router.put("/:id", async (req: Request, res: Response) => {
  const restaurantRepository = getRepository(Restaurant)
  const restaurant = await restaurantRepository.findOne(req.params.id)
  restaurantRepository.merge(restaurant, req.body)
  const results = await restaurantRepository.save(Restaurant)
  return res.send(results)
})

router.delete("/:id", async (req: Request, res: Response) => {
  const restaurantRepository = getRepository(Restaurant)
  const results = await restaurantRepository.delete(req.params.id)
  return res.send(results)
})

export default router

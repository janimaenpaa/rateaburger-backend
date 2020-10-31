import * as express from "express"
import { Request, Response } from "express"
import { getRepository } from "typeorm"
import { Burger } from "../entity/Burger"
import { BurgerService } from "../services/burgerService"

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

router.post("/", async (req: Request, res: Response) => {
  const burgerRepository = getRepository(Burger)
  const restaurant = await burgerRepository.create(req.body)
  const results = await burgerRepository.save(restaurant)
  return res.send(results)
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

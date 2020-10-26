import * as express from "express"
import { Request, Response } from "express"
import { getRepository } from "typeorm"
import { User } from "../entity/User"

const router = express.Router()

router.get("/", async function (_req: Request, res: Response) {
  const userRepository = getRepository(User)
  const users = await userRepository.find()
  res.json(users)
})

router.get("/:id", async function (req: Request, res: Response) {
  const userRepository = getRepository(User)
  const results = await userRepository.findOne(req.params.id)
  return res.send(results)
})

router.post("/", async function (req: Request, res: Response) {
  const userRepository = getRepository(User)
  const user = await userRepository.create(req.body)
  const results = await userRepository.save(user)
  return res.send(results)
})

router.put("/:id", async function (req: Request, res: Response) {
  const userRepository = getRepository(User)
  const user = await userRepository.findOne(req.params.id)
  userRepository.merge(user, req.body)
  const results = await userRepository.save(user)
  return res.send(results)
})

router.delete("/:id", async function (req: Request, res: Response) {
  const userRepository = getRepository(User)
  const results = await userRepository.delete(req.params.id)
  return res.send(results)
})

export default router

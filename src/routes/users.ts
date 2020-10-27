import * as express from "express"
import { Request, Response, NextFunction } from "express"
import { getRepository } from "typeorm"
import { User } from "../entity/User"
import { UserService } from "../services/userService"
import { body, validationResult } from "express-validator"
import HttpStatus from "http-status-codes"

const router = express.Router()

router.get("/", async (_req: Request, res: Response) => {
  const userRepository = getRepository(User)
  const users = await userRepository.find()
  res.json(users)
})

router.get("/:id", async (req: Request, res: Response) => {
  const userRepository = getRepository(User)
  const results = await userRepository.findOne(req.params.id)
  return res.send(results)
})

router.post(
  "/",
  [
    body("email").isEmail(),
    body("firstName").isLength({ min: 1 }),
    body("lastName").isLength({ min: 1 }),
    body("password").isLength({ min: 5 }),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const validationErrors = validationResult(req)

    if (validationErrors.isEmpty()) {
      const userService = new UserService()
      
      if (await userService.getByEmail(req.body.email)) {
        return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Email exists already!" })
      }

      await userService.instantiate(req.body)

      try {
        const response = await userService.add(req.body)
        return res.status(HttpStatus.OK).json({
          ...response,
        })
      } catch (error) {
        next(error)
      }
    }

    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ error: "validation error" })
  }
)

router.put("/:id", async (req: Request, res: Response) => {
  const userRepository = getRepository(User)
  const user = await userRepository.findOne(req.params.id)
  userRepository.merge(user, req.body)
  const results = await userRepository.save(user)
  return res.send(results)
})

router.delete("/:id", async (req: Request, res: Response) => {
  const userRepository = getRepository(User)
  const results = await userRepository.delete(req.params.id)
  return res.send(results)
})

export default router

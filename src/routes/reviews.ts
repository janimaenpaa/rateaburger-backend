import * as express from "express"
import { Request, Response, NextFunction } from "express"
import { getRepository } from "typeorm"
import { Review } from "../entity/Review"
import { BurgerService } from "../services/burgerService"
//import { UserService } from "../services/userService"
import HttpStatus from "http-status-codes"
import { ReviewService } from "../services/reviewService"

const router = express.Router()

router.get("/", async (_req: Request, res: Response) => {
  const reviewRepository = getRepository(Review)
  const reviews = await reviewRepository.find({ relations: ["user", "burger"] })
  res.json(reviews)
})

router.get("/:id", async (req: Request, res: Response) => {
  const reviewRepository = getRepository(Review)
  const results = await reviewRepository.findOne(req.params.id)
  return res.send(results)
})

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const burgerService = new BurgerService()
  //const userService = new UserService()
  const reviewService = new ReviewService()

  //const user = await userService.getById(req.body.user)
  const burger = await burgerService.getById(req.body.burger)

  if (!burger) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: "User or restaurant not found" })
  }

  const review = {
    ...req.body,
    date: new Date(),
    burger: burger,
  }

  const newReview = await reviewService.instantiate(review)

  try {
    const result = await reviewService.add(newReview)
    return res.send(result)
  } catch (error) {
    return next(error)
  }
})

router.put("/:id", async (req: Request, res: Response) => {
  const reviewRepository = getRepository(Review)
  const review = await reviewRepository.findOne(req.params.id)
  reviewRepository.merge(review, req.body)
  const results = await reviewRepository.save(review)
  return res.send(results)
})

router.delete("/:id", async (req: Request, res: Response) => {
  const reviewRepository = getRepository(Review)
  const results = await reviewRepository.delete(req.params.id)
  return res.send(results)
})

export default router

import * as express from "express"
import { Request, Response } from "express"
import { getRepository } from "typeorm"
import { Review } from "../entity/Review"

const router = express.Router()

router.get("/", async (_req: Request, res: Response) => {
  const reviewRepository = getRepository(Review)
  const reviews = await reviewRepository.find()
  res.json(reviews)
})

router.get("/:id", async (req: Request, res: Response) => {
  const reviewRepository = getRepository(Review)
  const results = await reviewRepository.findOne(req.params.id)
  return res.send(results)
})

router.post("/", async (req: Request, res: Response) => {
  const reviewRepository = getRepository(Review)
  const review = await reviewRepository.create(req.body)
  const results = await reviewRepository.save(review)
  return res.send(results)
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


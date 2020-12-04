import { getManager, Repository } from "typeorm"
import { Review } from "../entity/Review"

export class ReviewService {
  reviewRepository: Repository<Review>

  constructor() {
    this.reviewRepository = getManager().getRepository(Review)
  }

  instantiate(data: Object): Review | undefined {
    return this.reviewRepository.create(data)
  }

  async getAll(): Promise<Review[]> {
    return await this.reviewRepository.find({ relations: ["user"] })
  }

  async getById(id: string): Promise<Review> {
    if (id) {
      return await this.reviewRepository.findOne(id)
    }
    return Promise.reject(false)
  }

  async add(review: Review): Promise<Review> {
    const newReview = this.reviewRepository.create(review)
    return await this.reviewRepository.save(newReview)
  }

  async update(review: Review): Promise<Review | undefined> {
    try {
      const updatedReview = await this.reviewRepository.save(review)
      return updatedReview
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

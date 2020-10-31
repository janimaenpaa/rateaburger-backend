import * as express from "express"
import { Request, Response, NextFunction } from "express"
import { getRepository, getManager } from "typeorm"
import { Restaurant } from "../entity/Restaurant"
import { body, validationResult } from "express-validator"
import HttpStatus from "http-status-codes"
import { RestaurantService } from "../services/restaurantService"
import { RestaurantCoordinates } from "../entity/RestaurantCoordinates"

const router = express.Router()

router.get("/", async (_req: Request, res: Response) => {
  const restaurantRepository = getRepository(Restaurant)
  const restaurants = await restaurantRepository.find()
  return res.json(restaurants)
})

router.get("/:id", async (req: Request, res: Response) => {
  const restaurantRepository = getRepository(Restaurant)
  const results = await restaurantRepository.findOne(req.params.id)
  return res.send(results)
})

router.post(
  "/",
  [body("name").isLength({ min: 1 }), body("address").isLength({ min: 5 })],
  async (req: Request, res: Response, next: NextFunction) => {
    const validationErrors = validationResult(req)

    if (validationErrors.isEmpty()) {
      const restaurantService = new RestaurantService()

      const restaurantCoordinates = new RestaurantCoordinates()
      restaurantCoordinates.latitude = req.body.coordinates.latitude
      restaurantCoordinates.longitude = req.body.coordinates.longitude
      await getManager()
        .getRepository(RestaurantCoordinates)
        .save(restaurantCoordinates)

      const newRestaurant = {
        name: req.body.name,
        address: req.body.address,
        coordinates: restaurantCoordinates,
      }

      const restaurant = await restaurantService.instantiate(newRestaurant)

      try {
        const response = await restaurantService.add(restaurant)
        return res.status(HttpStatus.OK).json({ ...response })
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

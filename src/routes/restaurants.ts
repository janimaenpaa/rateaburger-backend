import "dotenv/config"
import * as express from "express"
import fetch from "node-fetch"
import { Request, Response, NextFunction } from "express"
import { getRepository, getManager } from "typeorm"
import { Restaurant } from "../entity/Restaurant"
import { body, validationResult } from "express-validator"
import HttpStatus from "http-status-codes"
import { RestaurantService } from "../services/restaurantService"
import { RestaurantCoordinates } from "../entity/RestaurantCoordinates"

const router = express.Router()

router.get("/", async (_req: Request, res: Response) => {
  const restaurantService = new RestaurantService()
  const restaurants = await restaurantService.getAll()
  return res.json(restaurants)
})

router.get("/:id", async (req: Request, res: Response) => {
  const restaurantRepository = getRepository(Restaurant)
  const results = await restaurantRepository.findOne(req.params.id)
  return res.send(results)
})

/* interface fetchedCoordinates {
  latitude: number
  longitude: number
} */

router.post(
  "/",
  [body("name").isLength({ min: 1 }), body("address").isLength({ min: 5 })],
  async (req: Request, res: Response, next: NextFunction) => {
    const validationErrors = validationResult(req)

    if (validationErrors.isEmpty()) {
      const restaurantService = new RestaurantService()
      const address = req.body.address.replace(/ä/g, "a").replace(/ö/g, "o")
      console.log(address)

      const fetchCoordinatesByAddress = await fetch(
        `http://api.positionstack.com/v1/forward?access_key=${process.env.API_KEY}&country=FI&region=Uusimaa&query=${address}`
      )
      const fetchResponse = await fetchCoordinatesByAddress.json()

      if (fetchResponse.data.length === 0) {
        return res.status(404).json({ message: "Address not found" })
      }

      const coordinates = fetchResponse.data[0]

      const restaurantCoordinates = new RestaurantCoordinates()
      restaurantCoordinates.latitude = coordinates.latitude
      restaurantCoordinates.longitude = coordinates.longitude

      const savedCoordinates = await getRepository(RestaurantCoordinates).save(
        restaurantCoordinates
      )

      const noImgUrl =
        "https://rateaburger.s3.eu-north-1.amazonaws.com/7164666a-a1f0-494a-a9c0-bb669f2d0195"

      const imgUrl = req.body.imgUrl

      const restaurant = {
        name: req.body.name,
        description: req.body.description,
        address: req.body.address,
        imgUrl: imgUrl ? imgUrl : noImgUrl,
        date: new Date(),
        coordinates: restaurantCoordinates,
      }

      const newRestaurant = await restaurantService.instantiate(restaurant)

      try {
        const response = await restaurantService.add(newRestaurant)
        savedCoordinates.restaurant = response
        await getManager()
          .getRepository(RestaurantCoordinates)
          .save(savedCoordinates)

        return res.status(HttpStatus.OK).json({ ...response })
      } catch (error) {
        return next(error)
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
  const restaurantService = new RestaurantService()
  const result = await restaurantService.delete(req.params.id)
  return res.send(result)
})

export default router

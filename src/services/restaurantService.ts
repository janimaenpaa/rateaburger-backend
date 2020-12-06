import { getManager, Repository } from "typeorm"
import { Restaurant } from "../entity/Restaurant"
import { RestaurantCoordinates } from "../entity/RestaurantCoordinates"

export class RestaurantService {
  restaurantRepository: Repository<Restaurant>
  coordinateRepository: Repository<RestaurantCoordinates>

  constructor() {
    this.restaurantRepository = getManager().getRepository(Restaurant)
    this.coordinateRepository = getManager().getRepository(
      RestaurantCoordinates
    )
  }

  instantiate(data: Object): Restaurant | undefined {
    return this.restaurantRepository.create(data)
  }

  async getAll(): Promise<Restaurant[]> {
    return await this.restaurantRepository.find({
      relations: ["coordinates", "burgers", "burgers.reviews"],
    })
  }

  async getById(id: string): Promise<Restaurant> {
    if (id) {
      return await this.restaurantRepository.findOne(id)
    }
    return Promise.reject(false)
  }

  async getByName(name: string): Promise<Restaurant | undefined> {
    const restaurant = await this.restaurantRepository.find({
      where: {
        name: name,
      },
    })

    if (restaurant && restaurant.length > 0) {
      return restaurant[0]
    }

    return undefined
  }

  async add(restaurant: Restaurant): Promise<Restaurant> {
    const newRestaurant = this.restaurantRepository.create(restaurant)
    return await this.restaurantRepository.save(newRestaurant)
  }

  async update(restaurant: Restaurant): Promise<Restaurant | undefined> {
    try {
      const updatedRestaurant = await this.restaurantRepository.save(restaurant)
      return updatedRestaurant
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async delete(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne(id)
    const coordinates = await this.coordinateRepository.findOne({
      where: { id: restaurant.coordinates.id },
    })

    try {
      console.log("Deleting coordinates")
      await this.coordinateRepository.delete(coordinates)
      console.log("Deleting restaurant")
      await this.restaurantRepository.delete(restaurant)
      return restaurant
    } catch (error) {
      return Promise.reject(false)
    }
  }
}

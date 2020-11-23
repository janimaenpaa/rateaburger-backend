import { getManager, Repository } from "typeorm"
import { Restaurant } from "../entity/Restaurant"

export class RestaurantService {
  restaurantRepository: Repository<Restaurant>

  constructor() {
    this.restaurantRepository = getManager().getRepository(Restaurant)
  }

  instantiate(data: Object): Restaurant | undefined {
    return this.restaurantRepository.create(data)
  }

  async getAll(): Promise<Restaurant[]> {
    return await this.restaurantRepository.find({ relations: ["coordinates"] })
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

  async add(Restaurant: Restaurant): Promise<Restaurant> {
    const newRestaurant = this.restaurantRepository.create(Restaurant)
    return await this.restaurantRepository.save(newRestaurant)
  }

  async update(Restaurant: Restaurant): Promise<Restaurant | undefined> {
    try {
      const updatedRestaurant = await this.restaurantRepository.save(Restaurant)
      return updatedRestaurant
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

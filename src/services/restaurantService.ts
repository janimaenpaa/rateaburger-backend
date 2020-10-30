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
    return await this.restaurantRepository.find()
  }

  async getById(id: string): Promise<Restaurant> {
    if (id) {
      return await this.restaurantRepository.findOne(id)
    }
    return Promise.reject(false)
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

import { getManager, Repository } from "typeorm"
import { Burger } from "../entity/Burger"

export class BurgerService {
  burgerRepository: Repository<Burger>

  constructor() {
    this.burgerRepository = getManager().getRepository(Burger)
  }

  instantiate(data: Object): Burger | undefined {
    return this.burgerRepository.create(data)
  }

  async getAll(): Promise<Burger[]> {
    return await this.burgerRepository.find({ relations: ["restaurant"] })
  }

  async getById(id: string): Promise<Burger> {
    if (id) {
      return await this.burgerRepository.findOne(id)
    }
    return Promise.reject(false)
  }

  async add(Burger: Burger): Promise<Burger> {
    const newBurger = this.burgerRepository.create(Burger)
    return await this.burgerRepository.save(newBurger)
  }

  async update(Burger: Burger): Promise<Burger | undefined> {
    try {
      const updatedBurger = await this.burgerRepository.save(Burger)
      return updatedBurger
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

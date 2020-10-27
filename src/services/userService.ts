import { getManager, Repository } from "typeorm"
import { User } from "../entity/User"

export class UserService {
  userRepository: Repository<User>

  constructor() {
    this.userRepository = getManager().getRepository(User)
  }

  instantiate(data: Object): User | undefined {
    return this.userRepository.create(data)
  }

  async getAll(): Promise<User[]> {
    return await this.userRepository.find()
  }

  async getById(id: string): Promise<User> {
    if (id) {
      return await this.userRepository.findOne(id)
    }
    return Promise.reject(false)
  }

  async getByEmail(email: string): Promise<User | undefined> {
    const users = await this.userRepository.find({
      where: {
        email: email,
      },
    })

    if (users && users.length > 0) {
      return users[0]
    }

    return undefined
  }

  async add(user: User): Promise<User> {
    const newUser = this.userRepository.create(user)
    return await this.userRepository.save(newUser)
  }

  async update(user: User): Promise<User | undefined> {
    try {
      const updatedUser = await this.userRepository.save(user)
      return updatedUser
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

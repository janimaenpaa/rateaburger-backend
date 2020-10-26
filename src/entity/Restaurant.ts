import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm"
import { Burger } from "./Burger"
import { RestaurantCoordinates } from "./RestaurantCoordinates"

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @Column()
  address: string

  @Column()
  imgUrl: string

  @OneToOne(
    () => RestaurantCoordinates,
    (coordinates) => coordinates.restaurant
  )
  @JoinColumn()
  coordinates: RestaurantCoordinates

  @OneToMany(() => Burger, (burger) => burger.restaurant)
  burgers: Burger[]
}

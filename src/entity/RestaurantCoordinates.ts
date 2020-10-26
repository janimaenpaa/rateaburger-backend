import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from "typeorm"
import { Restaurant } from "./Restaurant"

@Entity()
export class RestaurantCoordinates {
  @PrimaryGeneratedColumn()
  id: number

  @Column("double")
  longitude: number

  @Column("double")
  latitude: number

  @OneToOne(() => Restaurant, (restaurant) => restaurant.coordinates)
  @JoinColumn()
  restaurant: Restaurant
}

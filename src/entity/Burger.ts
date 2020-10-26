import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm"
import { Restaurant } from "./Restaurant"

export enum Patty {
  Beef = "beef",
  Chicken = "chicken",
  Fish = "fish",
  Veggie = "veggie",
}

@Entity()
export class Burger {
  @PrimaryGeneratedColumn()
  id: number

  @Column("varchar", { length: 255 })
  name: string

  @Column({ type: "enum", enum: Patty, default: Patty.Beef })
  patty: Patty

  @Column("text")
  imgUrl: string

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.burgers)
  restaurant: Restaurant
}

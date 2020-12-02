import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  OneToMany,
} from "typeorm"
import { Restaurant } from "./Restaurant"
import { Review } from "./Review"

export enum Patty {
  Beef = "beef",
  Chicken = "chicken",
  Fish = "fish",
  Veggie = "veggie",
}

@Entity()
export class Burger extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("varchar", { length: 255 })
  name: string

  @Column("varchar", { length: 500, nullable: true })
  description: string

  @Column({ type: "enum", enum: Patty, default: Patty.Beef })
  patty: Patty

  @Column("text", { nullable: true })
  imgUrl: string

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.burgers)
  restaurant: Restaurant

  @OneToMany(() => Review, (review) => review.burger)
  reviews: Review
}

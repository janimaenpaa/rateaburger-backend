import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  BaseEntity,
} from "typeorm"
import { Burger } from "./Burger"
import { RestaurantCoordinates } from "./RestaurantCoordinates"

@Entity()
export class Restaurant extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ unique: true })
  name: string

  @Column()
  description: string

  @Column()
  address: string

  @Column({ nullable: true })
  imgUrl: string

  @Column("timestamp")
  date: Date

  @OneToOne(
    () => RestaurantCoordinates,
    (coordinates) => coordinates.restaurant,
    { eager: true, onDelete: "CASCADE" }
  )
  @JoinColumn()
  coordinates: RestaurantCoordinates

  @OneToMany(() => Burger, (burger) => burger.restaurant)
  burgers: Burger[]
}

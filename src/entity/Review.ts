import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
} from "typeorm"
import { Burger } from "./Burger"
import { User } from "./User"

export enum Star {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
}

@Entity()
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column("varchar", { length: 600 })
  description: string

  @Column({ type: "enum", enum: Star, default: Star.Five })
  stars: Star

  @Column("timestamp")
  time: Date

  @ManyToOne(() => User, (user) => user.reviews)
  user: User

  @ManyToOne(() => Burger, (burger) => burger.reviews)
  burger: Burger
}

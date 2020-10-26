import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm"
import { Review } from "./Review"

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("varchar", { length: 255, unique: true })
  email: string

  @Column("varchar", { length: 55 })
  firstName: string

  @Column("varchar", { length: 55 })
  lastName: string

  @Column("text")
  password: string

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[]
}

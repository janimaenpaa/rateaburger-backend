import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  BeforeInsert,
} from "typeorm"
import bcrypt from "bcrypt"
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

  async setPassword(newPassword: string) {
    this.password = await bcrypt.hash(newPassword, 10)
  }

  @BeforeInsert()
  async encryptPassword() {
    this.password = await bcrypt.hash(this.password, 10)
  }
}

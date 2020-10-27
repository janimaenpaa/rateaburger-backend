import * as express from "express"
import { Request, Response } from "express"
import { UserService } from "../services/userService"
import { body, validationResult } from "express-validator"
import HttpStatus from "http-status-codes"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const router = express.Router()

router.post(
  "/",
  [body("email").isEmail(), body("password").isLength({ min: 5 })],
  async (req: Request, res: Response) => {
    const validationErrors = validationResult(req)

    if (validationErrors.isEmpty()) {
      const userService = new UserService()
      const user = await userService.getByEmail(req.body.email)

      const passwordCorrect =
        user === null
          ? false
          : await bcrypt.compare(req.body.password, user.password)

      if (!(user && passwordCorrect)) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: "Wrong password or email address.",
        })
      }

      const userForToken = {
        id: user.id,
        email: user.email,
      }

      const token = jwt.sign(userForToken, process.env.SECRET)

      return res.status(HttpStatus.OK).json({
        token,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      })
    }

    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ error: "validation error" })
  }
)

export default router

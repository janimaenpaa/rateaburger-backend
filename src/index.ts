import "dotenv/config"
import express from "express"
import { createConnection } from "typeorm"
import cors from "cors"

import userRouter from "./routes/users"
import restaurantRouter from "./routes/restaurants"
import reviewRouter from "./routes/reviews"
import loginRouter from "./routes/login"
import burgerRouter from "./routes/burgers"
import uploadRouter from "./routes/upload"

const PORT = process.env.PORT || 3001

createConnection().then(() => {
  const app = express()
  app.use(express.json())
  app.use(cors())

  app.use("/api/users", userRouter)
  app.use("/api/restaurants", restaurantRouter)
  app.use("/api/reviews", reviewRouter)
  app.use("/api/login", loginRouter)
  app.use("/api/burgers", burgerRouter)
  app.use("/api/upload", uploadRouter)

  app.listen(PORT, () => console.log(`Connected to port: ${PORT}`))
})

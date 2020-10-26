import "dotenv/config"
import express from "express"
import { createConnection } from "typeorm"
import userRouter from "./routes/users"

const PORT = process.env.PORT || 3001

createConnection().then(async () => {
  const app = express()
  app.use(express.json())

  app.use("/api/users", userRouter)

  app.listen(PORT, () => console.log(`Connected to port: ${PORT}`))
})

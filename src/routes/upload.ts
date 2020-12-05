import "dotenv/config"
import * as express from "express"
import { Request, Response } from "express"
import * as AWS from "aws-sdk"
import multer from "multer"
import * as uuid from "uuid"

const router = express.Router()

const s3bucket = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.post("/", upload.single("file"), async (req: Request, res: Response) => {
  const image = req.file

  const fileName = uuid.v4()

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: image.buffer,
    ContentType: image.mimetype,
    ACL: "public-read",
  }

  s3bucket.upload(
    params,
    async (error: Error, _data: AWS.S3.ManagedUpload.SendData) => {
      if (error) {
        return res.status(500).json({ error: true, Message: error })
      } else {
        const newFileUploaded = {
          imgUrl: process.env.AWS_BUCKET_URL + fileName,
          s3_key: params.Key,
        }
        return res.send(newFileUploaded)
      }
    }
  )
})

export default router

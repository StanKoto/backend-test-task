const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, 'config.env') })

module.exports = {
  main: {
    env: process.env.NODE_ENV,
    port: Number(process.env.PORT)
  },
  db: {
    devUri: process.env.PG_URI,
    prodUri: process.env.DATABASE_URL
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: Number(process.env.JWT_EXPIRES_IN)
  },
  multer: {
    fileSize: Number(process.env.MULTER_FILE_SIZE)
  },
  imageKit: {
    publicApiKey: process.env.IMAGEKIT_PUBLIC_API_KEY,
    privateApiKey: process.env.IMAGEKIT_PRIVATE_API_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
  }
};
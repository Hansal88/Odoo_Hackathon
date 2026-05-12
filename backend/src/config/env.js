require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'changeme',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
<<<<<<< HEAD
  unsplashAccessKey: process.env.UNSPLASH_ACCESS_KEY || '',
  unsplashSecretKey: process.env.UNSPLASH_SECRET_KEY || '',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
=======
>>>>>>> a50ef801b0859d710a0c82e1bb15db0cf3c41bb0
};

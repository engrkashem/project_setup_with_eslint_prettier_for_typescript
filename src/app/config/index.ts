import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  saltRounds: process.env.BCRYPT_SALT_ROUNDS,
  defaultPass: process.env.DEFAULT_PASS,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  rootUiURL: process.env.ROOT_UI_URL,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KAY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  cloudinaryName: process.env.CLOUDINARY_NAME,
  superAdminPassword: process.env.SUPER_ADMIN_PASSWORD,
};

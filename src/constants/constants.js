export const IS_DEV_ENV = process.env.NODE_ENV === "development";
export const BACKEND_URL = IS_DEV_ENV
  ? "http://localhost:5000"
  : "https://alggame-backend.onrender.com";

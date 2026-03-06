import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env.example") });

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret";

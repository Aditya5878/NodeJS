import dotenv from "dotenv";

dotenv.config();

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`❌ Missing environment variable: ${name}`);
  }
  return value;
}

export const env = {
  PORT: getEnv("PORT"),
  CORS_ORIGIN: getEnv("CORS_ORIGIN"),
  MONGO_URI: getEnv("MONGO_URI"),

  ACCESS_TOKEN_SECRET: getEnv("ACCESS_TOKEN_SECRET"),
  ACCESS_TOKEN_EXPIRES: getEnv("ACCESS_TOKEN_EXPIRES"),

  REFRESH_TOKEN_SECRET: getEnv("REFRESH_TOKEN_SECRET"),
  REFRESH_TOKEN_EXPIRES: getEnv("REFRESH_TOKEN_EXPIRES"),

  MAILTRAP_SMTP_HOST: getEnv("MAILTRAP_SMTP_HOST"),
  MAILTRAP_SMTP_PORT: Number(getEnv("MAILTRAP_SMTP_PORT")),
  MAILTRAP_SMTP_USERNAME: getEnv("MAILTRAP_SMTP_USERNAME"),
  MAILTRAP_SMTP_PASSWORD: getEnv("MAILTRAP_SMTP_PASSWORD"),
};

function secret(name: string, developmentDefault: string): string {
  const value = process.env[name];
  if (value) {
    return value;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`${name} must be set in production`);
  }
  return developmentDefault;
}

export const JWT_SECRET = secret('JWT_SECRET', 'test');
export const CRYPT_MASTER_KEY = secret('CRYPT_MASTER_KEY', 'test');
export const PORT = process.env.PORT || 3000;
export const DATABASE_USER = process.env.DATABASE_USER || 'root';
export const DATABASE_PASSWORD = secret('DATABASE_PASSWORD', 'temp');
export const BREVO_CLIENT = process.env.BREVO_KEY || 'temp';
export const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';

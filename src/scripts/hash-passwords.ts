import mongoose from 'mongoose';
import { migratePasswords } from '../auth/migrate-passwords';
import {
  CRYPT_MASTER_KEY,
  DATABASE_PASSWORD,
  DATABASE_USER,
  MONGO_URL,
} from '../constants';

async function main() {
  if (!process.env.CRYPT_MASTER_KEY) {
    throw new Error('CRYPT_MASTER_KEY must be set to read the old passwords');
  }
  await mongoose.connect(MONGO_URL, {
    dbName: 'form-service',
    auth: { username: DATABASE_USER, password: DATABASE_PASSWORD },
  });
  const owners = mongoose.connection.collection<{ password: string }>('owners');
  const result = await migratePasswords(
    {
      findAll: async () =>
        (await owners.find({}, { projection: { password: 1 } }).toArray()).map(
          (owner) => ({ id: String(owner._id), password: owner.password }),
        ),
      updatePassword: async (id, password) => {
        await owners.updateOne(
          { _id: new mongoose.Types.ObjectId(id) },
          { $set: { password } },
        );
      },
    },
    CRYPT_MASTER_KEY,
  );
  console.info(
    `hash-passwords: ${result.migrated} migrated, ${result.skipped} already hashed`,
  );
  await mongoose.disconnect();
}

main().catch(async (error: unknown) => {
  console.error('hash-passwords failed:', error);
  await mongoose.disconnect();
  process.exit(1);
});

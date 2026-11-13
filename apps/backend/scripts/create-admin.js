import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { configureMongoDns } from '../config/db.js';
import { Admin } from '../models/Admins.js';

dotenv.config();

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];

    if (!current.startsWith('--')) {
      continue;
    }

    const key = current.slice(2);
    const next = argv[index + 1];

    if (next && !next.startsWith('--')) {
      args[key] = next;
      index += 1;
    } else {
      args[key] = process.env[`ADMIN_${key.toUpperCase().replace(/-/g, '_')}`];
    }
  }

  return args;
}

async function main() {
  const cliArgs = parseArgs(process.argv.slice(2));
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is required. Copy apps/backend/.env.example to apps/backend/.env or set the environment variable.');
  }

  const username = String(cliArgs.username ?? process.env.ADMIN_USERNAME ?? 'admin').trim().toLowerCase();
  const email = String(cliArgs.email ?? process.env.ADMIN_EMAIL ?? 'admin@ciit.edu.ph').trim().toLowerCase();
  const fullName = String(cliArgs.fullName ?? process.env.ADMIN_FULL_NAME ?? 'CIIT Administrator').trim();
  const password = String(cliArgs.password ?? process.env.ADMIN_PASSWORD ?? '').trim();

  if (!username || !email || !fullName) {
    throw new Error('Username, email, and full name are required.');
  }

  if (!password || password.length < 12) {
    throw new Error('ADMIN_PASSWORD must be set and at least 12 characters long.');
  }

  const nameParts = fullName.split(' ');
  const first_name = nameParts[0] ?? fullName;
  const last_name = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

  configureMongoDns();
  await mongoose.connect(mongoUri);

  const existingAdmin = await Admin.findOne({
    $or: [{ username }, { email }],
  });

  if (existingAdmin) {
    await Admin.findByIdAndUpdate(existingAdmin._id, {
      username,
      email,
      first_name,
      last_name,
      password,
      role: 'admin',
      is_active: true,
    });

    console.log('Updated existing admin user:');
    console.log(`  username: ${username}`);
    console.log(`  email: ${email}`);
    console.log('  password: [updated and hashed in MongoDB via pre-save middleware]');
  } else {
    await Admin.create({
      username,
      email,
      first_name,
      last_name,
      password,
      role: 'admin',
      is_active: true,
    });

    console.log('Created new admin user:');
    console.log(`  username: ${username}`);
    console.log(`  email: ${email}`);
    console.log('  password: [stored as a bcrypt hash in MongoDB via pre-save middleware]');
  }

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error('Admin creation failed:', error.message);
  process.exit(1);
});

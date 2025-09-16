import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seedUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

    const usersData = [
      { wallet_address: '0xABC001', name: 'Alice', referredBy: null },
      { wallet_address: '0xABC002', name: 'Bob', referredBy: null },
      { wallet_address: '0xABC003', name: 'Charlie', referredBy: null },
    ];

    const createdUsers = [];
    for (const u of usersData) {
      const existing = await User.findOne({ wallet_address: u.wallet_address });
      if (!existing) {
        const user = await User.create(u);
        createdUsers.push(user);
      } else {
        createdUsers.push(existing);
      }
    }

    console.log('🎯 Seeded Users:');
    createdUsers.forEach(u => console.log(`${u.name} → ${u._id}`));

    await mongoose.disconnect();
    console.log('🛑 MongoDB disconnected');
  } catch (err) {
    console.error(err);
  }
};

seedUsers();

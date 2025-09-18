// models/Event.js
import mongoose from 'mongoose';
import redis from 'redis';

// -----------------------
// Event Schema
// -----------------------
const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  location: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

// Optional: Event leaderboard key in Redis
const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});
client.connect().catch(console.error);

eventSchema.methods.addAttendee = async function(userId) {
  if (!this.attendees.includes(userId)) {
    this.attendees.push(userId);
    await this.save();

    // Update Redis leaderboard for event participation
    await client.zIncrBy(`leaderboard_event_${this._id}`, 1, userId.toString());
  }
  return this;
};

eventSchema.methods.getLeaderboard = async function(top = 10) {
  return client.zRangeWithScores(`leaderboard_event_${this._id}`, 0, top - 1, { REV: true });
};

const Event = mongoose.model('Event', eventSchema);

export default Event;

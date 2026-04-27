// models/User.js
import mongoose from 'mongoose';

const healthMetricsSchema = new mongoose.Schema({
  overallHealth: Number,
  generalLifestyle: Number,
  nutritionHydration: Number,
  physicalActivity: Number,
  mindfulnessMentalHealth: Number,
  socialConnection: Number,
  selfCarePersonalGrowth: Number
}, { _id: false });

const dailyAnswerSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  answers: { type: Map, of: mongoose.Schema.Types.Mixed },
  updatedMetrics: healthMetricsSchema
}, { _id: false });

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: String,
  manifestation: String,
  streakCount: { type: Number, default: 1 },
  milestone: { type: Number, default: 1 },
  tag: { type: String, default: 'Beginner' },
  lastVisit: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  profilePhoto: String,
  hasCompletedAssessment: { type: Boolean, default: false },
  recommendations: {
    type: [String],
    default: [], // Explicit default
    validate: {
      validator: function(v) {
        return Array.isArray(v);
      },
      message: 'Recommendations must be an array'
    }
  },
  healthMetrics: healthMetricsSchema,
  dailyAnswers: [dailyAnswerSchema],
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
// models/UserScore.js
import mongoose from 'mongoose';

const UserScoreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
});

export default mongoose.models.UserScore || mongoose.model('UserScore', UserScoreSchema);

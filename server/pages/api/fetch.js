import 'dotenv/config';

import dbConnect from '../../utils/mongodb.js';
import UserScore from '../../models/UserScore.js';

require('dotenv').config();

export default async function handler(req, res) {
    await dbConnect();

    try {
        const scores = await UserScore.find({});
        res.status(200).json(scores);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
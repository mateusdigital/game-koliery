import 'dotenv/config';

import dbConnect from '../../utils/mongodb';
import UserScore from '../../models/UserScore';

require('dotenv').config();


export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const {name, score} = req.body;
            const userScore = new UserScore({name, score});
            await userScore.save();
            res.status(201).json({ success: true, data: userScore });
        } catch (error) {
            console.error('Error saving data:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(400).json({ error: 'Method not supported' });
    }
}
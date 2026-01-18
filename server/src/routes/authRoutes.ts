import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, passwordHash });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) { res.status(400).json({ message: 'Invalid credentials' }); return; }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) { res.status(400).json({ message: 'Invalid credentials' }); return; }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.json({ token, username: user.username });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

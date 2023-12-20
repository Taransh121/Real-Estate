import User from '../models/userModel.js';
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            res.status(400).json({ msg: "User already exists" });
        }
        const username1 = await User.findOne({ username });
        if (username1) {
            res.status(400).json({ msg: "Username is already taken by someone else." });
        }
        else {
            const salt = await bcryptjs.genSalt();
            const hashedPassword = await bcryptjs.hash(password, salt);
            const newUser = new User({
                username, email, password: hashedPassword
            });
            const savedUser = await newUser.save();
            return res.status(200).json({ savedUser });
        }
    } catch (error) {
        next(error);
    }
}
export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            res.status(400).json({ msg: "User does not exist" });
        } else {
            const comparePassword = await bcryptjs.compare(password, user.password);
            if (!comparePassword) {
                res.status(400).json({ msg: "Invalid credentials" });
            } else {
                const { password: pass, ...rest } = user._doc;
                const token = jwt.sign({ id: user._id }, process.env.Jwt_Token);

                // Omit 'rest' from the response
                return res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
            }
        }
    } catch (error) {
        next(error);
    }
}

export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_Token);
            const { password: pass, ...rest } = user._doc;
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo,
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_Token);
            const { password: pass, ...rest } = newUser._doc;
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
        }
    } catch (error) {
        next(error);
    }
};
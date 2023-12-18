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
            res.status(400).json({ msg: "User does not exists" });
        }
        else {
            const comparePassword = await bcryptjs.compare(password, user.password);
            if (!comparePassword) {
                res.status(400).json({ msg: "Invalid credentials" });
            } else {
                const { password: pass, ...rest } = user._doc;  //With the help of this it will not return password.
                const token = jwt.sign({ id: user._id }, process.env.Jwt_Token);
                return res.cookie('access_token', token, { httpOnly: true }).status(200).json({ rest });
            }
        }
    } catch (error) {
        next(error);
    }
}
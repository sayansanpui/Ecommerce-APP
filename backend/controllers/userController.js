import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
}

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User doesn't exists"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);

            res.status(200).json({
                success: true,
                user,
                token
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error occurred"
        });
    }
}

// Route for user registration
const registerUser = async (req, res) => {
    try {
        console.log('Request body:', req.body); // Add this debug line
        const { name, email, password } = req.body;

        // Check if required fields are present
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Checking user already exists or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // validating email format and strong password
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email"
            });
        }
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Creating new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        // Saving new user to database
        const user = await newUser.save();

        // Creating token for user
        const token = createToken(user._id);

        res.status(201).json({
            success: true,
            user,
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error occurred"
        });
    }
}

// Route for admin login
const adminLogin = async (req, res) => {


}


export { loginUser, registerUser, adminLogin };
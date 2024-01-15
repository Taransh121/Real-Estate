//Imports
import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv"; //For using process.env
import cookieParser from "cookie-parser";
const app = express();
const PORT = 8080;
import userRoute from "./Routes/userRoutes.js";
import authRoute from "./Routes/authRoutes.js";
import listingRoute from "./Routes/listingRoutes.js";
import path from "path";

//Configurations
dotenv.config();
app.use(express.json());
app.use(cookieParser());
// app.use(cors());
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const __dirname = path.resolve();

// Database
mongoose.set('strictQuery', false);
const mongoURL = `mongodb+srv://taranshchellani121:${process.env.Mongo_DB_Password}@mern-estate.6hozzzg.mongodb.net/?retryWrites=true&w=majority`;
// const mongoURL = `mongodb+srv://taranshchellani121:12345qwerty@mern-estate.6hozzzg.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connected");
}).catch((error) => {
    console.log(error);
});

app.listen(PORT, () => {
    console.log(`Server running at PORT - ${PORT} `);
});


//Routes
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/listing", listingRoute);

app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});




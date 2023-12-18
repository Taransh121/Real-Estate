//Imports
// import mongoose from ("mongoose");
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv"; //For using process.env
const app = express();
const PORT = 8080;

//Configurations
dotenv.config();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Routes
// app.use("/user", authRoute);
// app.use("/admin", adminAuthRoute);


//Database
// mongoose.set('strictQuery', false);
// const mongoURL = `mongodb+srv://Taransh:${process.env.Mongo_DB_Password}@cluster0.eq8d4zf.mongodb.net/Loginn?retryWrites=true&w=majority`;
// mongoose.connect(mongoURL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => {
//     console.log("Database connected");
// }).catch((error) => {
//     console.log(error);
// });


app.listen(PORT, () => {
    console.log(`Server running at PORT - ${PORT}`);
});
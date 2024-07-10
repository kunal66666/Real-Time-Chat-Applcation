import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';
import connectToDB from './db/connectToMongoDB.js';
const app = express();

dotenv.config()
const PORT = process.env.PORT || 8000;

app.use(express.json()); // to parse income request  with json payload( from req.body)
app.use(cookieParser());
app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes);
app.use("/api/users",userRoutes);

// app.get("/", (req, res) => {
//     // root route
//     res.send('Hell world');
// });



app.listen(PORT, () => {
    connectToDB();
    console.log(`Server is running on port ${PORT}`);
});
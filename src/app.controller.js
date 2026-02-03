import dotenv from "dotenv";
import connectDB from "./DB/connections.js";
import userRouter from './Modules/User/index.js';
import postRouter from './Modules/Post/index.js';
import commentRouter from './Modules/Comment/index.js';
import { getByPk } from "./Modules/User/user.controller.js";

dotenv.config({ path: "./src/config/dev.env" });

const bootstrap = async (app, express) => {
    app.use(express.json()); 
    await connectDB();

    app.get("/user/:id", getByPk);
    app.use("/users", userRouter);
    app.use("/posts", postRouter);
    app.use("/comments", commentRouter);

    // 4. Global Error Handling / Undefined Routes (Optional but good practice)
    app.use((req, res) => {
        res.status(404).json({ message: "Invalid URL / Page not found" });
    });
};

export default bootstrap;
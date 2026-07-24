/**
 * Central listener that receives client requests, processes data, and sends back responses
 */
import "dotenv/config";
import express from "express";
import { userRouter } from "./src/routes/user.routes";

// Create web server, build RESTful APIs, handle the backend request-response cycles
const app = express();
const PORT = 3000;

// Parse incoming JSON requests
app.use(express.json());

// Access authentication and authorization routes
app.use("/yourbible/users", userRouter);

// Test route
app.get('/api/health', (req, res) => {
    res.json({
        status: "Server is running perfectly!"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
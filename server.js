/**
 * Central listener that receives client requests, processes data, and sends back responses
 */

// Create web server, build RESTful APIs, handle the backend request-response cycles
const express = require('express');
const app = express();
const PORT = 3000;

// Parse incoming JSON requests
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
    res.json({
        status: "Server is running perfectly!"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
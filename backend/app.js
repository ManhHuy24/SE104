const express = require('express');
const dotenv = require('dotenv');
const corsMiddleware = require('./middleware/corsMiddleware');
const bodyParserMiddleware = require('./middleware/bodyParserMiddleware');
const studentRoutes = require('./routes/studentRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(bodyParserMiddleware);

// Routes
app.use('/api/students', studentRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

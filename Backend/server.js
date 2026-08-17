require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const auth = require('./middleware/auth');

const User = require('./models/User');
const Roadmap = require('./models/Roadmap');

const app = express();
// Add with your existing route imports
const quizRoutes = require('./routes/quiz');

// Mount the route below your auth/syllabus routes
app.use('/api/quiz', quizRoutes);

// Middleware
app.use(cors());
app.use(express.json());

// Set up file storage for uploaded PDFs
const upload = multer({ dest: 'uploads/' });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully!'))
    .catch((err) => console.error('MongoDB Connection Error:', err));

// Import auth router
const authRoutes = require('./routes/auth');

// Mount router middleware
app.use('/api/auth', authRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('EngineX Backend is live and connected!');
});

// PDF Upload & AI Processing Endpoint
app.post('/api/analyze-syllabus', auth, upload.single('syllabus'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file uploaded.' });
        }

        // Prepare PDF file to forward to Member 3's Python AI Engine
        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.file.path), req.file.originalname);

        // Call Member 3's AI server (running locally on port 8000)
        const aiResponse = await axios.post('http://127.0.0.1:8000/analyze', formData, {
            headers: { ...formData.getHeaders() }
        });

        // Save AI result directly into MongoDB
        const newRoadmap = new Roadmap({
            filename: req.file.originalname,
            summary: aiResponse.data.summary,
            coveredSkills: aiResponse.data.coveredSkills,
            missingIndustrySkills: aiResponse.data.missingIndustrySkills,
            recommendedRoadmap: aiResponse.data.recommendedRoadmap
        });

        await newRoadmap.save();

        // Clean up temporary uploaded file
        fs.unlinkSync(req.file.path);

        // Send saved result back to Member 1 (Frontend)
        res.status(200).json({
            message: 'Syllabus analyzed and roadmap created successfully!',
            roadmap: newRoadmap
        });

    } catch (error) {
        console.error('Error processing syllabus:', error.message);
        res.status(500).json({ error: 'Failed to process syllabus with AI service.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


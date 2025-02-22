import cors from 'cors'
import axios from 'axios'
import express from 'express'
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/predict", async (req, res) => {
    const stockSymbol = req.query.symbol || "MSFT";  // Default to MSFT

    try {
        // Call Flask API
        const response = await axios.get(`http://127.0.0.1:5001/predict?symbol=${stockSymbol}`);
        res.json(response.data);
    } catch (error) {
        console.error("Error calling Flask API:", error.message);
        res.status(500).json({ error: "Prediction failed" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Node.js Express running on http://localhost:${PORT}`);
});

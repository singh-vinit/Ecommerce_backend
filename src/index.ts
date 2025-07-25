import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();
const PORT = process.env.port || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString });
});

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));

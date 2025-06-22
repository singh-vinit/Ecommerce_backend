import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hi, from server");
});

const PORT = process.env.port || 4000;

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));

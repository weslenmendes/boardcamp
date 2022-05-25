import "dotenv/config";
import express, { json } from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(json());

app.get("/", (req, res) => {
  res.send({ msg: "Application is running..." });
});

app.listen(port, () => {
  console.log(`🚀 Server is running on: http://localhost:${port}`);
});

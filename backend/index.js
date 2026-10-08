import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import authRouters from "./routers/auth.js";
import adminRouters from "./routers/admin.js";
import usersRouters from "./routers/users.js";
import uploadRouters from "./routers/upload.js";
import tasksRouters from "./routers/tasks.js";

import { swaggerSpec } from "./utils/swagger.js";
import { notFound } from "./middlewares/notfound.js";
import { errorHandler } from "./middlewares/errorhandle.js";
import { limiter } from "./middlewares/rateLimit.js";

const app = express();

app.use(cors({
  origin: "https://dugsiiyementerapi-1.onrender.com",
}));

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/users", usersRouters);
app.use("/api/auth", authRouters);
app.use("/api/admin", adminRouters);
app.use("/api/upload", uploadRouters);
app.use("/api/tasks", tasksRouters);

app.get("/api/health", (req, res) => {
  res.json("Server is working... 😊");
});

app.use(limiter);

if (process.env.NODE_ENV === "production") {

    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    // Serve the frontend app

    app.get(/.*/, (req, res) => {
        res.send(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
    })
}


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(
    process.env.NODE_ENV === "development"
      ? process.env.MONGO_URI_DEV
      : process.env.MONGO_URI_PRO
  )
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.log("✖️ Error connecting to MongoDB", err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
import express from "express";

const app = express();
app.use(express.json());

import cors from "cors";

import morgan from "morgan";
import { logger } from "./middlewares/logger.js";
import authRouters from "./routers/auth.js";
import adminRouters from "./routers/admin.js";
import mongoose from "mongoose";
import helmet from "helmet";
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './utils/swagger.js';

app.use(
  cors({
    origin: ["http://localhost:5873"],
  }),
);
if(process.env.NODE_ENV=="development"){
    app.use(morgan("dev"));
}

// app.use(logger);
import usersRouters from "./routers/users.js";
import uploadRouters from "./routers/upload.js";
import tasksRouters from "./routers/tasks.js";
import "dotenv/config";

import { notFound } from "./middlewares/notfound.js";
import { errorHandler } from "./middlewares/errorhandle.js";
import { limiter } from "./middlewares/rateLimit.js";

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/users", usersRouters);

app.use("/auth", authRouters);
app.use("/admin", adminRouters);
app.use("/upload", uploadRouters);
app.use("/tasks", tasksRouters);
app.use(limiter)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.NODE_ENV === "development"?  process.env.MONGO_URI_DEV: process.env.MONGO_URI_PRO)
  .then(() => {
    console.log(" ✅Connected to MongoDB");
  })
  .catch((err) => {
    console.log("✖️ Error connecting to MongoDB", err);
  });
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});

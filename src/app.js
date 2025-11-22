import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "./utils/logger.js";
import morgan from "morgan";
import errorHandler from "./middlewares/error.middlewares.js";
//import routes
import healthcheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/user.routes.js";

const app = express();

// cookie parser
app.use(cookieParser());

// cors policy
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// json data allowed to come in
app.use(
  express.json({
    limit: "16kb",
  })
);

// make url better to read
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// serving file from a static source
app.use(express.static("public"));

// our custom logger
const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

//routes
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);

app.use(errorHandler);
export { app };

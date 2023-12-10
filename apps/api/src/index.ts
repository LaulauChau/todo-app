import "module-alias/register";

import cookieParser from "cookie-parser";
import cors from "cors";
import express, { json, urlencoded } from "express";
import passport from "passport";

import { ErrorHandler } from "~/middlewares/error-handler";
import { router } from "./routers";

const { CLIENT_URL, NODE_ENV, SERVER_PORT } = process.env;

const app = express();

app.use(cookieParser());
app.use(cors({ origin: CLIENT_URL }));
app.use(passport.initialize());
app.use(json());
app.use(urlencoded({ extended: true }));

if (NODE_ENV === "development") {
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

app.use("/api", router);
app.use(ErrorHandler);

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}`);
});

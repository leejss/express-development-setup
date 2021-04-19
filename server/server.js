import config from "../config/config";
import app from "./express";
import mongoose from "mongoose";

app.listen(config.port, (err) => {
  if (err) {
    console.error(err);
  }
  console.log(`Server started on port ${config.port}`);
});

mongoose.connect(
  config.mongoUri,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    console.log(`Mongodb connected`);
    if (err) console.error(err);
  }
);

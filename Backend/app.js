const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// Local modules
const userRouter = require("./routes/userRoute");
const taskRouter = require("./routes/taskRoute");
const contactRouter = require("./routes/contactRoute");
const subscriberRouter = require("./routes/subscriberRoute");

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hi");
});

app.use(userRouter);
app.use(taskRouter);
app.use(contactRouter);
app.use(subscriberRouter);

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT, () => {
  console.log("🚀 Server running on port 3000");
});

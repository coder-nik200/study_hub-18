const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// Local modules
const userRouter = require("./routes/userRoute");
const taskRouter = require("./routes/taskRoute");
const contactRouter = require("./routes/contactRoute");
const subscriberRouter = require("./routes/subscriberRoute");
const chatRouter = require("./routes/chatRoutes");
const expertRouter = require("./routes/expertRouter");
const notificationRouter = require("./routes/notificationRoute");
const profileRouter = require("./routes/profileRoute");
const taskAssignmentRoute = require("./routes/taskAssignmentRoute");

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Increase limit to 10MB
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
// app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hi");
});

app.use(userRouter);
app.use(taskRouter);
app.use(contactRouter);
app.use(subscriberRouter);
app.use(chatRouter);
app.use(expertRouter);
app.use(notificationRouter);
app.use(profileRouter);
app.use(taskAssignmentRoute);

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT, () => {
  console.log("🚀 Server running on port 3000");
});

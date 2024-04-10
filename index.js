const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const app = express();
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const path = require('path');
const {fileURLToPath} = require('url');

//custom dir_name
const filename = __filename
const dirname = path.dirname(filename);

app.use(
  cors({
    origin: "*",
  })
);
dotenv.config();

app.use(express.json());

//use client in server
app.use(express.static(path.join(dirname, '/live-chat-client/build')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/live-chat-client/build/index.html'))
})

const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log("Server is Connected to Database");
  } catch (err) {
    console.log("Server is NOT connected to Database", err.message);
  }
};
connectDb();

app.get("/", (req, res) => {
  res.send("API is running123");
});

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log("Server is Running..."));

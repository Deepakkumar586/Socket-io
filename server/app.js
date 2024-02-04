import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
const port = 2000;

const app = express();
const server = createServer(app);
// app.use(cors());

// circuit ka instnace create kar liya hai
/* jab bhi io ki bat ho it means circuit ki bat ho rhi hai    */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

server.listen(port, () => {
  console.log(`Server is Running on Port ${port}`);
});
app.get("/", (req, res) => {
  res.send("Hello WOrld ");
});

// yha par ak circuit bna liya
// socket -->> individual socket
io.on("connection", (socket) => {
  console.log("User Connected");
  console.log("ID", socket.id);
});

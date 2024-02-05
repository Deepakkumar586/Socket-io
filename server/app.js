import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const port = 2000;
const secretKey = "deep";

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

app.get("/login", (req, res) => {
  const token = jwt.sign({ _id: "dhsdfsdfhsflafa" }, secretKey);

  res
    .cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
    .json({
      message: "Login Success",
    });
});
// this is middleware socket io---->authenticate ke liye use kar skte hai
const user = false;
io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, (err) => {
    if (err) return next(err);
    const token = socket.request.cookies.token;
    if (!token) return next(new Error("Authentication Error"));
    const decoded = jwt.verify(token, secretKey);
    next();
  });
});

// yha par ak circuit bna liya
// socket -->> individual socket
io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  /* socket.emit me ak particular socket ko message jayega */
  // socket.emit("welcome",`Welcome to the server ${socket.id}`);

  /* socket broadcast means us socket ko message nhi jayega jo web reload karega aur sbhi ko jayega  isase pta chal jayega ki kon server login kiya hai */
  // socket.broadcast.emit("welcome",`join the server ${socket.id}`);

  // listner
  socket.on("message", ({ message, room }) => {
    console.log({ message, room });
    // io.emit("receive-message",data);

    // socket.broadcast.emit("receive-message",data);
    /* IO.to bhi use kar skte hai  */
    socket.to(room).emit("receive-message", message);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User Joined Room ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("Disconnect the ", socket.id);
  });
});

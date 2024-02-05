import React, { useMemo, useState } from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const App = () => {
  // continuous backend re-render nhi hoga when change input keyword----only change when  we refresh page
  const socket = useMemo(
    () => io("http://localhost:2000", { withCredentials: true }),
    []
  );

  // when change input keybord again again re-render backend
  // const socket = io("http://localhost:2000");

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketID] = useState("");
  const [receivemessage, setRecieveMessage] = useState([]);
  const [roomName, setRoomName] = useState("");

  console.log(receivemessage);

  console.log(message);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });

    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketID(socket.id);
      console.log("connected", socket.id);
    });
    /* socket on listner */
    socket.on("welcome", (s) => {
      console.log(s);
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });
    socket.on("receive-message", (data) => {
      console.log("receive-message", data);
      setRecieveMessage((receivemessage) => [...receivemessage, data]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <Container maxWidth="sm">
      <Box sx={{ height: 500 }} />
      <Typography variant="h4" component="div" gutterBottom>
        Welcome to socket.io
      </Typography>

      <Typography variant="h4" component="div" gutterBottom>
        {socketID}
      </Typography>

      {/* form when user join room */}
      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlined-basic"
          label="Room Name"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Join
        </Button>
      </form>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="Message"
          variant="outlined"
        />

        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="Romm-Message"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>
      <Stack>
        {receivemessage.map((m, index) => (
          <Typography key={index} variant="h6" component="div" gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;

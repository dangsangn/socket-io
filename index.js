const PORT = process.env.PORT || 8900;
const io = require("socket.io")(PORT, {
  cors: {
    origin: "https://myhome-2603.vercel.app",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user?.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user?.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user?.userId === userId);
};

io.on("connection", (socket) => {
  //when ceonnect
  console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket?.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ sender, receiverId, content }) => {
    const user = getUser(receiverId);
    io.to(user?.socketId).emit("getMessage", {
      sender,
      content,
    });
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

const express = require("express");
const dotenv = require("dotenv");
const dbconnect = require("./db/dbconnect");
const usercontrol = require("./routes/authUser");
const messageroute = require("./routes/messageroute");
const userRouter = require("./routes/userRoute");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const { app, server } = require("./Socket/socket");

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ✅ API Routes
app.use("/api/auth", usercontrol);
app.use("/api/message", messageroute);
app.use("/api/user", userRouter);

// ✅ Serve frontend build

// ✅ Serve frontend build
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});
const port = process.env.PORT || 3000;
server.listen(port, () => {
  dbconnect();
  console.log(`Server running on port ${port}`);
});

const dotenv = require("dotenv");
dotenv.config(); // Load env variables first

const express = require("express");
const dbconnect = require("./db/dbconnect");
const usercontrol = require("./routes/authUser");
const messageroute = require("./routes/messageroute");
const userRouter = require("./routes/userRoute");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const { app, server } = require("./Socket/socket");

const rootDir = path.resolve(); // safer variable name

app.use(express.json()); 
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/api/auth", usercontrol);
app.use("/api/message", messageroute);
app.use("/api/user", userRouter);

// Static files for frontend
app.use(express.static(path.join(rootDir, "/frontend/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(rootDir, "frontend", "dist", "index.html"));
});

// Default route
app.get("/", (req, res) => {
    res.send('Hello from the server!');
});

// Start server
const port = process.env.PORT || 5000;
server.listen(port, () => {
    dbconnect();
    console.log(`Server running on port ${port}`);
});

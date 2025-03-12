import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js"
import messageRoute from "./routes/message.route.js"
import dotenv from "dotenv"
import { connectdb } from "./lib/db.js";
import cookieParser from "cookie-parser"
import socketSetup from "./lib/socket.js";
const { app, server, io } = socketSetup;

import path from "path";


dotenv.config()

const PORT = process.env.PORT;
const __dirname = path.resolve();


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(cookieParser());


app.use("/api/auth",authRoutes);
app.use("/api/messages", messageRoute);



if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")));

  app.get("*", (req,res)=>{
     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}


server.listen(PORT, () => {
  console.log("Server started at port:"+PORT);
  connectdb();
});
import express from "express";
import cors from "cors";
import "dotenv/config";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/messageRoutes.js";
import userRouter from "./routes/userRoutes.js";
import experienceRouter from "./routes/experienceRoutes.js";
import skillRouter from "./routes/skillRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import { Project } from "./models/projectSchema.js";
import { Skill } from "./models/skillSchema.js";
import { Experience } from "./models/experienceSchema.js";
import { Message } from "./models/messageSchema.js";
import linkRouter from "./routes/linkRoutes.js";
import settingRouter from "./routes/settingRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";

//app config
const app = express();

//middleware
app.use(express.json());
app.use(cors({
  origin: [process.env.ADMIN_DASHBOARD_URL,process.env.FRONTEND_URL], // Allow requests from your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // if you're dealing with cookies or authentication
}));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);


app.use("/api/message", messageRouter);
app.use("/api/user", userRouter);
app.use("/api/skill",skillRouter);
app.use("/api/link",linkRouter)
app.use("/api/project",projectRouter);
app.use("/api/experience",experienceRouter);
app.use("/api/setting",settingRouter);
app.use("/api/chatbot", chatbotRoutes);


app.get('/api/summary', async (req, res) => {
  try {
    const [messageCount, projectCount, skillCount, experienceCount] = await Promise.all([
      Message.countDocuments(),    
      Project.countDocuments(),   
      Skill.countDocuments(),      
      Experience.countDocuments() 
    ]);

    res.status(200).json({
      messageCount,
      projectCount,
      skillCount,
      experienceCount,
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});


export default app;

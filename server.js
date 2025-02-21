import { connectDB } from "./config/db.js";
import app from "./app.js";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  function reloadWebsite() {
    axios
      .get(process.env.URL)
      .then((response) => {
        console.log("website reloded");
      })
      .catch((error) => {
        console.error(`Error : ${error.message}`);
      });
  }
  
  setInterval(reloadWebsite, 60000);


connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server Started at ${process.env.PORT}`);
});

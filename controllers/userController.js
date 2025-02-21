import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto"

export const register = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No files were uploaded." });
    }

    const { profileImage} = req.files;

    // Upload profile Image
    const cloudinaryResponseForProfileImage = await cloudinary.uploader.upload(
      profileImage.tempFilePath,
      { folder: "PORTFOLIO PROFILE IMAGE" }
    );
    if (
      !cloudinaryResponseForProfileImage ||
      cloudinaryResponseForProfileImage.error
    ) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponseForProfileImage.error || "Unknown Cloudinary error"
      );
      return res.status(400).json({ message: "Failed to upload profile image." });
    }


    // Destructure req.body to get the form data
    const {
      name,
      email,
      homeText,
      aboutText,
      address,
      password,
      resumeURL,
      projects,
      experience,
      words,
    } = req.body;

    // Create the user
    const user = await User.create({
      name,
      email,
      homeText,
      aboutText,
      address,
      password,
      resumeURL,
      words: words || [],
      projects,
      experience,
      profileImage: {
        public_id: cloudinaryResponseForProfileImage.public_id,
        url: cloudinaryResponseForProfileImage.secure_url,
      },
    });

    generateToken(user, "User Registered", 201, res);
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error. Registration failed." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(500).json({ message: "Email and Password required" });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(500).json({ message: "Invalid credentials!" });
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return res.status(500).json({ message: "Invalid credentials!" });
  }
  generateToken(user, "Logged In", 201, res);
};

export const logout = async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()), // Expire the cookie immediately
      httpOnly: true,
      secure: true,  // Ensure secure for HTTPS
  sameSite: "None", // Ensure the cookie is only accessible via HTTP (not client-side scripts)
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
};

export const getUser = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, user });
};

export const updateProfile = async (req, res) => {
  try {
    const newUserdata = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      homeText: req.body.homeText,
      aboutText: req.body.aboutText,
      resumeURL: req.body.resumeURL,
      projects:req.body.projects,
      experience:req.body.experience,
      words: JSON.parse(req.body.words),
      
    };

    const user = await User.findById(req.user.id); // Fetch user only once

    // Update Profile Image
    if (req.files && req.files.profileImage) {
      const profileImage = req.files.profileImage;
      const profileImageId = user.profileImage?.public_id; // Use optional chaining
      if (profileImageId) {
        await cloudinary.uploader.destroy(profileImageId);
      }
      const cloudinaryResponse = await cloudinary.uploader.upload(
        profileImage.tempFilePath,
        { folder: "PORTFOLIO PROFILE IMAGE" }
      );
      newUserdata.profileImage = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    }

  
    // Update User Data
    const updatedUser = await User.findByIdAndUpdate(req.user.id, newUserdata, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      message: "Profile Updated",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return res.status(400).json({ message: "Please Fill All Fields!" });
  }

  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(currentPassword);

  if (!isPasswordMatched) {
    return res.status(400).json({ message: "Incorrect Current password" });
  }

  if (newPassword != confirmNewPassword) {
    return res
      .status(400)
      .json({ message: "New Password and Confirmed Password do not match!" });
  }

  user.password = newPassword;

  await user.save();
  res.status(200).json({
    success: true,
    message: "Password Updated!",
  });
};

export const getUserForPortfolio = async (req, res) => {
  const id = process.env.USER_ID;
  const user = await User.findById(id);
  res.status(200).json({
    success: true,
    user,
  });
};

export const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).json({   
      message: "User Not Found",
    });
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.ADMIN_DASHBOARD_URL}/password/reset/${resetToken}`;

  const message = `Your Reset Password Token is :- \n\n ${resetPasswordUrl} \n\n If you've not request for this please ignore it!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Personal Portfolio Dashboard Recovery Password",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully!`,
    });
  } catch (error) {
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save();
    console.log(error);
    
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const resetPassword = async (req,res) => {
  const {token} = req.params

  const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex")

  const user = await User.findOne({resetPasswordToken,resetPasswordExpire:{$gt:Date.now()},})

  if(!user){
    return res.status(400).json({message:"Reset password token is invalid or has been expired"})
  }

  if(!req.body.password && !req.body.confirmPassword){
    return res.status(400).json({message:"Password & Confirmed Password are required"})
  }

  if(req.body.password !== req.body.confirmPassword){
    return res.status(400).json({message:"Password & Confirmed Password do not match!"})
  }
    user.password = req.body.password
    user.resetPasswordExpire = undefined
    user.resetPasswordToken = undefined
    await user.save()
    generateToken(user,"Reset Password Successfully",200,res)
  
};




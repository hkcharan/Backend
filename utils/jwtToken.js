export const generateToken = (user, message, statusCode, res) => {
    const token = user.generateJsonWebToken();

    // Define cookie options
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000 // Days to milliseconds
        ),
        httpOnly: true,
        secure: true, // Only secure cookies in production
        sameSite: "None", // The cookie cannot be accessed via JavaScript on the client-side
    };

    // Send the token in a cookie along with the response
    res.status(statusCode)
        .cookie("token", token, cookieOptions)
        .json({
            success: true,
            message,
            token,
            user,
        });
};

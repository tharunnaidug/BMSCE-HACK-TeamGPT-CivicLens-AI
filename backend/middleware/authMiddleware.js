import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  try {

    let token;

    // ================= FROM COOKIE =================

    if (req.cookies.token) {
      token = req.cookies.token;
    }

    // ================= FROM HEADER =================

    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token =
        req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {

    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

export default protect;
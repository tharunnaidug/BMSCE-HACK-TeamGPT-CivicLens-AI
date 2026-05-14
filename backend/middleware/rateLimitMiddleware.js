import rateLimit from "express-rate-limit";

const complaintLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,

  message: {
    success: false,
    message: "Too many complaints submitted. Try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

export default complaintLimiter;
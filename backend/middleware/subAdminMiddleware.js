const isSubAdmin = async (req, res, next) => {
    try {
  
      if (
        req.user.role !== "sub_admin" &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "Sub Admin access denied",
        });
      }
  
      next();
  
    } catch (error) {
  
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  };
  
  export default isSubAdmin;
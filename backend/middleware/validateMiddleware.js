const validateComplaint = (
    req,
    res,
    next
  ) => {
  
    const {
      image_url,
      latitude,
      longitude,
    } = req.body;
  
    if (
      !image_url ||
      !latitude ||
      !longitude
    ) {
      return res.status(400).json({
        success: false,
        message:
          "image_url, latitude and longitude are required",
      });
    }
  
    next();
  };
  
  
  const validateAuth = (
    req,
    res,
    next
  ) => {
  
    const {
      email,
      password,
    } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }
  
    next();
  };
  
  
  export {
    validateComplaint,
    validateAuth,
  };
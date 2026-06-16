const jwt = require('jsonwebtoken');
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // ✅ Fixed: Make sure we set user properly
    req.user = decoded;
    // Also add userId for easier access
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
module.exports = auth;
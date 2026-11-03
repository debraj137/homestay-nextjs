const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  console.log('Auth middleware:', req.method, req.originalUrl);
  const token = req.header("Authorization")?.split(" ")[1]; // Expecting "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "No token, Access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission to perform this action" });
    }

    next();
  };
}

function requirePurpose(purpose) {
  return (req, res, next) => {
    if (!req.user || req.user.purpose !== purpose) {
      return res.status(403).json({ message: "This token cannot be used for this action" });
    }

    next();
  };
}

function optionalAuth(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return next();

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (_) {
    // A public resource should remain readable without a valid optional token.
  }
  next();
}

module.exports = authenticate;
module.exports.requireRole = requireRole;
module.exports.requirePurpose = requirePurpose;
module.exports.optionalAuth = optionalAuth;

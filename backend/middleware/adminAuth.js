const requireAdmin = (req, res, next) => {
  const token = req.header("x-admin-token");
  const expected = process.env.ADMIN_TOKEN;

  if (!expected) {
    return res
      .status(500)
      .json({ error: "Server is missing ADMIN_TOKEN configuration" });
  }

  if (!token || token !== expected) {
    return res.status(401).json({ error: "Unauthorized — admin access only" });
  }

  next();
};

module.exports = requireAdmin;

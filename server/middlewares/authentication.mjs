export const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    // If it's an API request, return JSON
    if (req.originalUrl.startsWith("/api")) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    // Otherwise, redirect to login page
    res.redirect("/login");
  }
};
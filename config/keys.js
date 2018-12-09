// Development DB settings
module.exports = {
  DB_DEV_HOST: process.env.DB_DEV_HOST || "ds125574.mlab.com",
  DB_DEV_USER: process.env.DB_DEV_USER || "express-react-agents-test",
  DB_DEV_DBNAME: process.env.DB_DEV_DBNAME || "express-react-agents-test",
  DB_DEV_PASS: process.env.DB_DEV_PASS || "a123456",
  DB_DEV_PORT: process.env.DB_DEV_PORT || "25574",
  WEB_DEV_PORT: process.env.WEB_DEV_PORT || 8080,

  // Produciton DB settings
  DB_HOST: process.env.DB_HOST || "",
  DB_USER: process.env.DB_USER || "",
  DB_DBNAME: process.env.DB_DBNAME || "",
  DB_PASS: process.env.DB_PASS || "",
  DB_PORT: process.env.DB_PORT || "",
  WEB_PORT: process.env.WEB_PORT || 80,

  GOOGLE_MAP_API_KEY:
    process.env.GOOGLE_MAP_API_KEY || "AIzaSyC6TJQb2514VXBFJp9mp_xPv9ohRkIlqWI"
};

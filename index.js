import connectDB from './config/db.js';
import authRouter from './routes/userRoutes.js';

/**
 * Initialize the auth package
 * @param {Object} options - { dbUri, jwtSecret, mailConfig }
 */
export function init(options) {
  if (!options?.dbUri) throw new Error("dbUri is required");
  if (!options?.jwtSecret) throw new Error("jwtSecret is required");

  // Store global config for controllers/utils
  global.jwtSecret = options.jwtSecret;
  global.mailConfig = options.mailConfig || {};

  // Connect to MongoDB
  connectDB(options.dbUri);
}

// Export auth router for users to mount in their own app
export { authRouter };

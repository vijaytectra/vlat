/**
 * PM2 Ecosystem Configuration for Hostinger VPS
 *
 * Usage:
 *   pm2 start ecosystem.config.js --env production
 *   pm2 restart vlat-backend
 *   pm2 logs vlat-backend
 *   pm2 save
 */

module.exports = {
  apps: [
    {
      name: "vlat-backend",
      script: "server.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "./logs/error.log",
      out_file: "./logs/output.log",
      log_file: "./logs/combined.log",
      time: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};

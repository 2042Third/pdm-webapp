module.exports = {
  apps: [
    {
      name: 'pdm-webapp',
      script: '.output/server/index.mjs',
      env: {
        NODE_ENV: 'production',
      },
      out_file: '/home/Static8148/webapp/logs/pdm-webapp-out.log', // stdout log
      error_file: '/home/Static8148/webapp/logs/pdm-webapp-error.log', // stderr log
      log_file: '/home/Static8148/webapp/logs/pdm-webapp-combined.log', // combined log
      merge_logs: true // Ensures better organization by combining logs
    }
  ]
};

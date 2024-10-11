module.exports = {
  apps: [
    {
      name: 'st-student-student',
      script: 'npm',
      args: 'start',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
  ],
};

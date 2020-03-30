// FILE: <project>/backend/ecosystem.config.js

module.exports = {
  apps : [{
    name: 'DSL_backend',
    script: 'npm',
    args: 'run start:prod',
    autorestart: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};

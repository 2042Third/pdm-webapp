module.exports = {
  apps: [{
    name: 'pdm-webapp',
    script: '.output/server/index.mjs',
    env: {
      NODE_ENV: 'production',
    }
  }]
}

const config = {
  server: {
    proxy: {
      '/api': {
        target: 'https://ominous-guacamole-97wwj5769vf9p5-8080.app.github.dev',
        changeOrigin: true,
        secure: false,
      },
    },
  },
};

export default config;
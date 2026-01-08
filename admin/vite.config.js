import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  //console.log("Loaded env:", env);

  return defineConfig({
    plugins: [react()],
    server: {
      port: Number(env.VITE_PORT) || 4000,
      strictPort: true,
      proxy: {
      '/api': {
        target: env.VITE_API_URL,
        changeOrigin: true,
      },
    },
    },
  });
};
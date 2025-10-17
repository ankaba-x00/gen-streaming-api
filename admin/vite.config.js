import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  //console.log("Loaded env:", env);

  return defineConfig({
    plugins: [react()],
    server: {
      port: Number(env.VITE_PORT) || 5173,
      strictPort: true,
      proxy: {
      '/api': {
        target: 'http://localhost:8800',
        changeOrigin: true,
      },
    },
    },
  });
};
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        allowedHosts: ['ducanh.nport.link'],
        // Hoặc dùng: allowedHosts: true để cho phép tất cả các host
    },
});
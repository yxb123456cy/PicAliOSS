import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';
import dotenv from 'dotenv';
import path from 'path';

// 加载 .env.local 环境变量
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

export default defineConfig({
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./', import.meta.url)),
            '~': fileURLToPath(new URL('./', import.meta.url)),
        }
    },
    test: {
        environment: 'node',
        globals: true,
    }
});

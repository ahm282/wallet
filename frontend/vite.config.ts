import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
    plugins: [react(), mkcert()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        cors: true,
        allowedHosts: true,
        // proxy: {
        //     "/api": {
        //         target: "http://localhost:8080",
        //         changeOrigin: true,
        //     },
        // },
    },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	base: "/",
	plugins: [react(), tailwindcss()],
	server: {
		host: "0.0.0.0",
		port: 5173,
		watch: {
			usePolling: true, // Indispensable pour Docker sur Windows/macOS
		},
		strictPort: true, // Évite que Vite change de port si le 5173 est pris
	},
});

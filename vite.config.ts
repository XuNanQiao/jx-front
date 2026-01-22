/*
 * @Author: ZHAO
 * @Date: 2026-01-07 17:05:47
 * @LastEditTime: 2026-01-07 17:07:55
 * @LastEditors: ZHAO
 * @Description:
 * @FilePath: \jx\vite.config.ts
 *
 */
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import { viteMockServe } from "vite-plugin-mock";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      vue(),
      UnoCSS(),
      viteMockServe({
        mockPath: "mock",
        enable: mode === "development",
        logger: true,
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: "assets/[name].[hash].js",
          chunkFileNames: "assets/[name].[hash].js",
          assetFileNames: "assets/[name].[hash].[ext]",
          manualChunks: {
            "vue-vendor": ["vue", "vue-router", "pinia"],
            "antd-vendor": ["ant-design-vue"],
            "chart-vendor": ["echarts", "vue-echarts"],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    server: {
      port: 3002,
      host: true,
      open: true,
      strictPort: false,
      proxy: {
        [env.VITE_API_BASE_URL]: {
          target: env.VITE_PROXY_TARGET || "http://10.80.1.45:8000",
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${env.VITE_API_BASE_URL}`), ""),
          configure: (proxy, _options) => {
            proxy.on("error", (err, _req, _res) => {
              console.log("代理错误", err);
            });
            proxy.on("proxyReq", (proxyReq, req, _res) => {
              console.log("发送请求：", req.method, req.url);
            });
            proxy.on("proxyRes", (proxyRes, req, _res) => {
              console.log("收到响应：", proxyRes.statusCode, req.url);
            });
          },
        },
      },
    },
  };
});

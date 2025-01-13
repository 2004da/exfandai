const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');
const path = require('path');

const app = express();

// 从 config.json 文件读取配置
let config;
try {
  const configPath = path.join(__dirname, 'config.json');
  const configData = fs.readFileSync(configPath, 'utf8');
  config = JSON.parse(configData);
} catch (error) {
  console.error('Error reading or parsing config.json:', error);
  process.exit(1); // 遇到错误直接退出
}

const proxyRoutes = config.proxyRoutes;


// 循环创建反向代理路由
for (const path in proxyRoutes) {
  const target = proxyRoutes[path];
  app.use(path, createProxyMiddleware({
    target: target,
    changeOrigin: true,
    ws: true, // 开启 WebSocket 支持
  }));
}

// 定义根路径的路由
app.get('/', (req, res) => {
  res.send('Hello World');
});

// 监听端口
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

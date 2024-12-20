// 引入 express
const express = require('express');
const path = require('path');

// 创建 express 应用
const app = express();

// 设置静态文件目录（Vite 构建后的 dist 文件夹）
app.use(express.static(path.join(__dirname, 'dist')));

// 路由配置：任何请求都返回 index.html（Vue 的前端路由管理）
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 启动服务器
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

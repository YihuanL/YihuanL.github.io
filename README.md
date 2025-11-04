# 个人博客网站

一个现代化的个人博客网站，采用响应式设计和暗色模式支持，提供完整的博客功能。

## 功能特点

- 🎨 现代化UI设计，支持暗色模式
- 📱 完全响应式布局
- ✍️ 富文本编辑器
- 👤 用户认证和个人资料管理
- 📊 文章管理和分析
- 💬 评论和互动功能
- 🔍 搜索功能
- 🚀 性能优化和SEO友好

## 技术栈

- **前端**: HTML5, Tailwind CSS, JavaScript (ES6+)
- **图标**: Material Icons
- **字体**: Inter
- **工具**: Live Server, ESLint, Prettier

## 快速开始

### 在线预览

访问 [GitHub Pages](https://yourusername.github.io/personal-website) 查看在线演示。

### 本地开发

1. 克隆仓库
```bash
git clone https://github.com/yourusername/personal-website.git
cd personal-website
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 打开浏览器访问 `http://localhost:3000`

## 项目结构

```
personal_website/
├── assets/                 # 静态资源
│   ├── css/               # 样式文件
│   ├── js/                # JavaScript文件
│   └── images/            # 图片资源
├── components/            # 可复用组件
├── pages/                 # 页面文件
├── ui/                    # UI设计文件
├── utils/                 # 工具函数
├── index.html             # 首页
├── package.json           # 项目配置
└── README.md              # 项目说明
```

## 部署

### GitHub Pages

本项目已配置为自动部署到GitHub Pages。当您推送代码到`main`分支时，GitHub Actions会自动构建和部署网站。

### 手动部署

1. 构建项目
```bash
npm run build
```

2. 将`dist`目录内容上传到您的Web服务器

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 作者

- **您的名字** - *初始工作* - [YourUsername](https://github.com/YourUsername)

## 致谢

- [Tailwind CSS](https://tailwindcss.com/)
- [Material Icons](https://fonts.google.com/icons)
- [Inter Font](https://rsms.me/inter/)
- [Live Server](https://www.npmjs.com/package/live-server)
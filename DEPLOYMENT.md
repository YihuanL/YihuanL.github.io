# GitHub 部署指南

本指南将帮助您将个人博客网站部署到GitHub Pages。

## 前置条件

1. 拥有GitHub账户
2. 已安装Git
3. 项目代码已提交到本地Git仓库

## 部署步骤

### 1. 创建GitHub仓库

1. 登录您的GitHub账户
2. 点击右上角的"+"号，选择"New repository"
3. 填写仓库信息：
   - **Repository name**: `personal-website` (或您喜欢的名称)
   - **Description**: 个人博客网站
   - **Public**: 选择公开（GitHub Pages需要）
   - **Add a README file**: 可选
   - **Add .gitignore**: 可选
   - **Choose a license**: 可选

4. 点击"Create repository"

### 2. 推送代码到GitHub

在项目根目录执行以下命令：

```bash
# 添加远程仓库（替换YOUR_USERNAME为您的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/personal-website.git

# 推送代码到GitHub
git push -u origin master
```

### 3. 启用GitHub Pages

1. 在您的GitHub仓库页面，点击"Settings"选项卡
2. 在左侧菜单中找到"Pages"
3. 在"Source"部分，选择：
   - **Branch**: `master`
   - **Folder**: `/ (root)`
4. 点击"Save"

### 4. 配置GitHub Actions自动部署

项目已包含GitHub Actions工作流配置文件（`.github/workflows/deploy.yml`），它会：

1. 在代码推送到`master`分支时自动触发
2. 构建项目
3. 自动部署到GitHub Pages

### 5. 访问您的网站

部署完成后，您的网站将在以下地址可用：

```
https://YOUR_USERNAME.github.io/personal-website
```

## 更新网站

当您需要更新网站时：

1. 修改代码
2. 提交更改：
   ```bash
   git add .
   git commit -m "Your commit message"
   ```
3. 推送到GitHub：
   ```bash
   git push origin master
   ```

GitHub Actions将自动构建和部署您的更改。

## 自定义域名（可选）

如果您想使用自定义域名：

1. 在仓库的Settings > Pages中，找到"Custom domain"
2. 输入您的域名（如 `www.yourdomain.com`）
3. 在您的域名提供商处添加DNS记录：
   - 类型: `CNAME`
   - 名称: `www`
   - 值: `YOUR_USERNAME.github.io`
4. 在项目根目录创建`CNAME`文件，内容为您的域名

## 故障排除

### 构建失败

1. 检查GitHub Actions日志
2. 确保所有文件都已正确提交
3. 检查package.json中的脚本是否正确

### 网站无法访问

1. 确保GitHub Pages已启用
2. 检查部署是否成功
3. 等待几分钟让DNS传播

### 样式或脚本不加载

1. 检查文件路径是否正确
2. 确保使用相对路径
3. 检查浏览器控制台的错误信息

## 性能优化建议

1. 压缩图片文件
2. 使用CDN加速静态资源
3. 启用Gzip压缩
4. 添加适当的缓存头

## 安全注意事项

1. 不要在前端代码中暴露敏感信息
2. 使用HTTPS（GitHub Pages自动提供）
3. 定期更新依赖项

## 更多资源

- [GitHub Pages文档](https://docs.github.com/en/pages)
- [GitHub Actions文档](https://docs.github.com/en/actions)
- [自定义域名指南](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
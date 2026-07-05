# 华思维的个人网站

这是一个纯静态个人网站，整体视觉采用孤树星空背景、月光色文字、留白和磨砂玻璃质感。页面保留安静的个人档案馆气质，并加入极少量星点与低频流星效果，作为个人知识库和第二大脑的入口。

首页入口包括：

- 个人简介
- 学习
- 项目
- 作品
- 博客
- AI 对话记录
- 个人知识库 V1.0
- 联系方式

## 个人知识库结构

`personal-knowledge-base` 按 Obsidian Vault 的方式组织：

- `学习/`
- `项目/`
- `作品/`
- `博客/`

网站页面对应：

- `knowledge-base.html`：知识库总览
- `knowledge-learning.html`：学习
- `knowledge-projects.html`：项目
- `knowledge-portfolio.html`：作品
- `knowledge-blog.html`：博客

## 本地预览

直接打开 `index.html` 即可预览，不需要安装依赖。

## 发布说明

当前站点适合发布到 GitHub Pages。发布前可以按需继续补充邮箱、社交账号、作品链接或更详细的工作经历。

如需替换公网地址，可以运行：

```bash
node set-public-url.mjs https://你的公开网址/
```

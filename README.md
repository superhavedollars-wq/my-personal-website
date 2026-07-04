# 华思维的个人网站

这是一个纯静态个人网站，内容整理自桌面上的 `readme v1.0.docx`。首页包含五张可点击卡片，分别进入：

- 自我素材清单
- 人机分工图
- AI 完整追问记录
- AI 协作契约
- 人机协作避坑准则

## 本地预览

直接打开 `index.html` 即可预览，不需要安装依赖。

## 让别人搜得到

网站必须发布到公网地址后，搜索引擎才可能收录。发布前请做三件事：

1. 把 `robots.txt` 和 `sitemap.xml` 里的 `https://your-domain.example` 替换成真实域名。
2. 部署到 GitHub Pages、Vercel、Netlify 或自己的服务器。
3. 在百度站长平台、Google Search Console 或 Bing Webmaster Tools 提交真实的 `sitemap.xml`。

拿到公网网址后，可以运行：

```bash
node tools/set-public-url.mjs https://你的公开网址/
```

如果公开发布，请先确认愿意公开页面中的个人经历、心理状态与学业信息。

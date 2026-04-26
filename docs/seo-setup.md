# SharkJaw — GSC / GA4 / Bing 接入 SOP

> 本站静态化构建到 Cloudflare Workers Assets，所有 SEO/分析接入位都在 `src/data/analytics.ts`。
> 验证 ID / Measurement ID 公开可见，按数据文件管理（不走 env vars）。

## 现状

代码侧已就绪（Claude 已搭好），等控制台拿值：

| 项 | 已就绪 | 待你拿值 |
|---|---|---|
| `public/robots.txt`（含 GPTBot/ClaudeBot/PerplexityBot allow）| ✅ | — |
| `dist/client/sitemap-index.xml` + `sitemap-0.xml`（17 URL）| ✅ | — |
| `Analytics.astro` 注入位（GTM head script + GSC + Bing meta）| ✅ 空值时不渲染 | — |
| `AnalyticsBody.astro` GTM noscript fallback | ✅ 接到 `<body>` 顶部 | — |
| Open Graph / Twitter Card / Schema.org | ✅ BaseLayout + SchemaOrg.astro | — |
| GTM Container ID | ✅ `GTM-KH2THF2B` 已接入 | David 在 GTM 里配 GA4 tag |
| GA4 Measurement ID | ✅ `G-P0R4NMS557` 记录在册 | 通过 GTM 触发，非直注 |
| GSC 验证码 | — | David 控制台拿 |
| Bing 验证码（可选）| — | David 控制台拿 |

## 1. Google Search Console（必做）

1. 打开 https://search.google.com/search-console
2. **Add property** → 选 **URL prefix** → 填 `https://sharkjaw.net/`
3. 验证方式选 **HTML tag**，弹出来类似：
   ```html
   <meta name="google-site-verification" content="abc123XYZ_长字符串" />
   ```
4. 复制 `content="..."` 那一长串（~40 字符），扔给我，我加到 `src/data/analytics.ts` → `gscVerification`
5. 我重 build + David 部署到 Cloudflare → 回 GSC 点 **Verify** → ✅
6. 验证通过后，GSC → Sitemaps → **Add a new sitemap** → 填 `sitemap-index.xml` → Submit

> **备选**：DNS TXT 验证（Cloudflare DNS 加一条 TXT），不需要部署。如果你想这条路，给我 GSC 给的 TXT 值，我引你加到 CF DNS。

## 2. Google Tag Manager + Google Analytics 4（必做）

**架构决定**：GTM 是唯一注入入口，GA4 通过 GTM 内部 tag 触发，**不**走 gtag.js 直注。GTM + gtag.js 双发会让 GA4 事件翻倍，污染数据。

### 2.1 GTM Container（已接入代码）
- Container ID: `GTM-KH2THF2B`（已写入 `src/data/analytics.ts`）
- 注入位置：`<head>` 顶部 + `<body>` 后 noscript fallback（双段，符合 Google 官方规范）

### 2.2 GA4 Property（已拿 Measurement ID）
- Measurement ID: `G-P0R4NMS557`
- 后续 API 拉数据需要 **Property ID**（不是 Measurement ID），后续填入

### 2.3 在 GTM 内配 GA4 Configuration Tag（David 必做一次，之后不动）
1. 打开 https://tagmanager.google.com → 进 SharkJaw container `GTM-KH2THF2B`
2. **Tags** → **New** → 命名 `GA4 - All Pages`
3. **Tag Configuration** → 选 **Google Analytics: GA4 Configuration**
4. **Measurement ID** 填 `G-P0R4NMS557`
5. **Triggering** → 选 **All Pages**
6. **Save** → 右上角 **Submit** → Version Name `Initial GA4 setup` → **Publish**
7. 验证：访问 sharkjaw.net → 浏览器 DevTools Network → 应看到 `/g/collect?...&tid=G-P0R4NMS557` 请求；GA4 → Reports → Realtime 应显示 1 个用户

### 2.4 GA4 ↔ GSC 关联
GSC 验证通过后：GA4 → Admin → **Property Settings** → **Search Console Links** → Link → 选 `sharkjaw.net` Property

## 3. Bing Webmaster Tools（建议做 — B2B 海外买家用 Edge 多）

1. 打开 https://www.bing.com/webmasters
2. **Add a site** → `https://sharkjaw.net`
3. 验证方式选 **Add a meta tag**，复制 `content="..."` 那串
4. 扔给我 → 加到 `src/data/analytics.ts` → `bingVerification`
5. Bing Webmaster → **Sitemaps** → Submit `https://sharkjaw.net/sitemap-index.xml`

> **快捷方式**：Bing Webmaster 支持 **Import from GSC** —— GSC 验证完后直接 import，省一次部署。

## 4. 你给我值之后我做的事

```
1. 编辑 src/data/analytics.ts，把空字符串换成你给的值
2. npm run build → 验证 dist/client/index.html 里有 meta tag 和 gtag.js 出现
3. git commit + 你部署到 Cloudflare Workers
4. 回 GSC / GA4 / Bing 各自点 Verify
5. 各自 Sitemap 提交 sitemap-index.xml
```

## 5. AI 搜索引擎可见性（已就绪，无需操作）

`public/robots.txt` 已显式 **allow** 主流 AI 爬虫，让 SharkJaw 的内容能被 ChatGPT / Claude / Perplexity / Google AI Overview 收录：

```
User-agent: GPTBot          Allow: /
User-agent: ClaudeBot       Allow: /
User-agent: PerplexityBot   Allow: /
User-agent: Google-Extended Allow: /
```

未来要做的（不是现在）：
- IndexNow API 自动推送（每次 deploy 触发，让 Bing/Yandex 即时收录）
- Schema.org 加 `Product` / `FAQPage` markup（部分页已有，可扩到全产品页）
- AI 搜索专项：把 `/about` `/certifications` `/products/*` 写成"AI 答案友好"格式（Q→A 段落 + 数据表）

## 6. 验证清单（部署后跑一遍）

```bash
# 1. robots.txt 可访问
curl -sI https://sharkjaw.net/robots.txt | head -1   # 期望 200

# 2. Sitemap 可访问
curl -sI https://sharkjaw.net/sitemap-index.xml | head -1   # 期望 200
curl -s  https://sharkjaw.net/sitemap-index.xml | grep -c '<loc>'  # 期望 1（指向 sitemap-0.xml）
curl -s  https://sharkjaw.net/sitemap-0.xml | grep -c '<loc>'      # 期望 17

# 3. GSC meta tag 存在
curl -s https://sharkjaw.net/ | grep google-site-verification

# 4. GA4 gtag 存在
curl -s https://sharkjaw.net/ | grep googletagmanager.com/gtag

# 5. Open Graph + Schema.org 存在
curl -s https://sharkjaw.net/ | grep -c 'og:title\|application/ld+json'
```

## 文件位置

- 数据文件：`src/data/analytics.ts`
- 注入组件：`src/components/Analytics.astro`
- 注入点：`src/layouts/BaseLayout.astro` `<head>` 末尾
- robots.txt：`public/robots.txt`
- sitemap：构建产物 `dist/client/sitemap-index.xml`（@astrojs/sitemap 自动生成）

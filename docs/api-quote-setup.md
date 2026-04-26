# /api/quote — 上线前配置步骤

联系表单 POST `/api/quote` 由 `src/pages/api/quote.ts`（Astro API route, `prerender = false`）处理，
部署到 Cloudflare Workers（@astrojs/cloudflare 适配器，Workers Assets 模式），
通过 **Resend API** 发邮件。

部署前必须完成下面三步，否则表单会回落到 `?error=server`。

## 1. Resend 账号 + 域名验证

1. 注册 https://resend.com（3000 封/月免费）
2. Dashboard → Domains → **Add Domain** → `sharkjaw.net`
3. Resend 会生成 4 条 DNS 记录（SPF + 3 条 DKIM），在 Cloudflare DNS 里添加：
   - `TXT` `@` → SPF 片段
   - `TXT` `resend._domainkey` → DKIM 公钥
   - `TXT` `_dmarc` → DMARC 策略（若未配过）
   - 其他按 Resend 指引填
4. Cloudflare 里把这些记录的 **Proxy 状态设为"DNS only"**（灰色云），不要橘色
5. 回 Resend Domains 点 **Verify DNS Records**，等到变 ✅ Verified（通常几分钟）

## 2. 生成 API Key

1. Resend → API Keys → **Create API Key**
2. 权限选 **Sending access** → Domain: `sharkjaw.net`
3. 复制 `re_xxxxxxxx` 开头的 key（**只显示一次**）

## 3. 添加 Cloudflare Workers 环境变量

Cloudflare Dashboard → **Workers & Pages → sharkjaw-net → Settings → Variables and Secrets**

| 变量名 | 值 | 类型 |
|---|---|---|
| `RESEND_API_KEY` | `re_xxxxxxxx`（上一步拿到的） | **Secret** |
| `QUOTE_TO` | `sales@sharkjaw.net` | Plain（可选，不设走默认） |
| `QUOTE_CC` | `josuncn@gmail.com` | Plain（可选） |
| `QUOTE_FROM` | `SharkJaw <noreply@sharkjaw.net>` | Plain（可选，域名必须已 Verified） |

> `QUOTE_FROM` 的域名部分**必须和 Resend 里验证通过的域名一致**，否则 Resend 会拒收。
> 还没验证完可以临时用 Resend 的 `onboarding@resend.dev` 测试。

保存后 **重新部署** 一次，环境变量才会加载到 Worker runtime。

## 4. 收件链路

- **To**: `sales@sharkjaw.net`
  - 假定已在 Cloudflare Email Routing 配置转发到 `josuncn@gmail.com`
  - 没配过的话：Cloudflare → Email → Email Routing → Routing Addresses 添加 alias
- **CC**: `josuncn@gmail.com`（保险起见双收一份，避免 Email Routing 故障丢单）

## 5. 本地开发

本地 `npm run dev` 起 Astro dev server，API route 会跑但**没有 Cloudflare runtime env**。
要本地完整测 Worker 用：

```bash
npm run build
npx wrangler dev --config dist/server/wrangler.json
# wrangler dev 会自动读取项目根的 .dev.vars 文件（git-ignored）
```

`.dev.vars` 例子（不要 commit，加到 .gitignore）：
```
RESEND_API_KEY=re_xxxxxxxx
QUOTE_TO=test@example.com
QUOTE_CC=
```

## 6. 验证

上线后：
1. 打开 https://sharkjaw.net/contact/ 提交一条测试询盘
2. 检查 Gmail 收件箱（sales@sharkjaw.net 转发 + josuncn@gmail.com CC，两边都应收到）
3. 浏览器应跳转到 `/contact/?sent=1` 并显示绿色成功 banner
4. Cloudflare Dashboard → Pages → Functions → Logs 看是否有报错

## 反垃圾设计

- **Honeypot**: 表单里有隐藏字段 `website`，机器人会填，人不会。有值直接丢弃（静默返回 success 不给机器人线索）
- **基本校验**: name/email 必填，email 正则
- **IP 与国家**: 从 `cf-connecting-ip` / `request.cf.country` 记入邮件 footer，方便手工判别
- **未来可选**: 接 Cloudflare Turnstile（免费）做人机验证，目前先不加复杂度

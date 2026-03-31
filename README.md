# todaysigh.com — 地球人共识 · Today’s Sigh

> 一个极简的数字公共长椅：每天一句「地球人都知道」的事，全球用户共同提交共鸣句——不排名、不点赞、只共享轻叹.

## 🌍 产品核心
- **零门槛**：打开即用，无需注册  
- **真共识**：全球用户看到同一题、同一回复流  
- **干净安全**：无广告、无追踪、无竞争  
- **每日一题**：自动切换，看完就走  

## 📁 文件说明
| 文件 | 作用 |
|------|------|
| `index.html` | 主页（前端） |
| `style.css` | 样式 |
| `script.js` | 前端逻辑（调用 `/api/today` & `/api/submit`） |
| `vercel.json` | Vercel 部署配置 |
| `api/today.js` | 返回今日题目（Vercel Edge Function） |
| `api/submit.js` | 接收回复，存入 Vercel KV |
| `CNAME` | 用于绑定 `todaysigh.com` |

---

## 🚀 部署指南（无需命令行！纯网页操作）

### 方案 A：通过 GitHub + Vercel Web 控制台（推荐 ✅）
1. **上传代码到 GitHub**  
   - 将本目录全部文件（除 `.git` 外）压缩为 `dailysigh.zip`  
   - 访问 [https://github.com/new](https://github.com/new)  
   - 创建新仓库：`todaysigh`（Public）  
   - 点击 **“Upload files”** → 拖入解压后的所有文件 → Commit changes  

2. **部署到 Vercel**  
   - 打开 [https://vercel.com/new](https://vercel.com/new)  
   - 选择你的 GitHub 账号 → 选仓库 `todaysigh`  
   - 点击 **Deploy**（Vercel 自动识别 `vercel.json` 和 `api/`）  
   - 等待 1–2 分钟，部署成功后你会看到：  
     → `https://todaysigh.vercel.app`  

3. **绑定自定义域名 `todaysigh.com`**  
   - 在 Vercel 项目 Dashboard → Settings → Domains  
   - 输入 `todaysigh.com` → 点击 **Add**  
   - Vercel 会生成 2 条 DNS 记录（通常是 CNAME + TXT 验证）  
   - 登录 [Cloudflare](https://dash.cloudflare.com) → DNS → 添加记录：  
     ```
     Type: CNAME  
     Name: @  
     Content: cname.vercel-dns.com (按 Vercel 提示填写)  
     Proxy: Proxied (橙色云)
     ```  
   - 保存后，5–10 分钟生效 → 访问 `https://todaysigh.com`！

> 💡 国内提示：若 Vercel 部署卡住，可尝试在 `vercel.json` 中添加：
> ```json
> "regions": ["sfo1", "sin1"]
> ```

### 方案 B：备用（GitHub Pages + Cloudflare Worker）
如 Vercel 不稳定，我可为你生成 Cloudflare Worker 版本（同样免 CLI），只需你粘贴代码到 Workers 编辑器。

---

## 📝 今日题库（20 题轮换）
1. 油价又要涨了  
2. 明天要上班  
3. 外卖永远迟到  
4. 手机电量低于 20% 就慌  
5. 下雨必没带伞  
...（共 20 条，见 script.js 中 TOPIC_BANK）

---

## 🌟 Slogan
> **Today’s Sigh — You’re not alone. Just human.**

欢迎贡献新题！可提 Issue 或 PR 🌍
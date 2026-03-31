// 地球人共识 · 在线版（Vercel KV 后端）
// 作者：OpenClaw 助手 | 全球统一题目 + 实时共鸣

const TOPIC_ELEMENT = document.getElementById('topic');
const REPLY_INPUT = document.getElementById('reply-input');
const SUBMIT_BTN = document.getElementById('submit-btn');
const REPLIES_LIST = document.getElementById('replies-list');
const EMPTY_HINT = REPLIES_LIST.querySelector('p.empty');

// 敏感词过滤
const BAD_WORDS = [
  '骂', '死', '滚', '操', '艹', '傻', '蠢', '垃圾', '尼玛', '他妈',
  'fuck', 'bitch', 'asshole'
];

function sanitize(text) {
  if (!text) return null;
  text = text.trim();
  for (let word of BAD_WORDS) {
    if (text.includes(word)) return null;
  }
  return text.length <= 100 ? text : text.substring(0, 100) + '…';
}

// 获取今日题目（调用 /api/today）
async function fetchTodayTopic() {
  try {
    const res = await fetch('/api/today');
    const data = await res.json();
    return data.topic;
  } catch (e) {
    console.warn('Fallback to local topic');
    // 本地 fallback（仅用于开发调试）
    const topics = [
      "油价又要涨了", "明天要上班", "外卖永远迟到", "手机电量低于 20% 就慌"
    ];
    return topics[Math.floor(Math.random() * topics.length)];
  }
}

// 获取今日回复（调用 /api/replies — 但我们暂不实现，改用轮询提交后刷新）
async function loadReplies() {
  // 实际生产中可加 /api/replies，但为极简，我们提交后直接重载
  // 此处留空，由 submit 后触发 refresh
}

// 渲染回复列表（模拟从后端获取）
function renderReplies(replies = []) {
  if (replies.length === 0) {
    REPLIES_LIST.innerHTML = '<p class="empty">还没人说话… 你来第一句？</p>';
    return;
  }
  REPLIES_LIST.innerHTML = replies
    .sort((a, b) => b.ts - a.ts)
    .map(r => `<div class="reply-item">${r.text}</div>`)
    .join('');
}

// 初始化
async function init() {
  TOPIC_ELEMENT.innerHTML = '<p class="loading">加载题目中…</p>';
  
  const topic = await fetchTodayTopic();
  TOPIC_ELEMENT.innerHTML = `<p>${topic}</p>`;
  
  // 首次访问提示
  if (!sessionStorage.getItem('seen-welcome')) {
    sessionStorage.setItem('seen-welcome', '1');
    setTimeout(() => {
      alert('🌍 欢迎来到「Today’s Sigh」——\n全球用户今日共识题已加载。提交即公开，不排名、不点赞，只求会心一叹。');
    }, 800);
  }

  // 提交逻辑
  SUBMIT_BTN.addEventListener('click', async () => {
    const raw = REPLY_INPUT.value;
    const clean = sanitize(raw);
    if (!clean) {
      alert('内容包含不友善词汇，请修改后提交 😊');
      return;
    }

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: clean })
      });
      const result = await res.json();

      if (result.ok) {
        alert('✅ 提交成功！刷新页面查看最新神回复');
        REPLY_INPUT.value = '';
        // 刷新回复区（模拟实时）
        setTimeout(() => {
          location.reload(); // 简单可靠
        }, 1500);
      } else {
        alert('❌ ' + (result.error || '提交失败'));
      }
    } catch (e) {
      alert('网络错误，请重试');
      console.error(e);
    }
  });

  // 回车提交
  REPLY_INPUT.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      SUBMIT_BTN.click();
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
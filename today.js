// api/today.js — 返回今日题目（首次生成，后续复用）
import { kv } from '@vercel/kv';

const TOPIC_BANK = [
  "油价又要涨了",
  "明天要上班",
  "外卖永远迟到",
  "手机电量低于 20% 就慌",
  "下雨必没带伞",
  "手机自动更新后卡得像在加载人生",
  "快递显示“已签收”，但门缝里没东西",
  "闹钟响了三次，最后靠梦里自己关掉",
  "看到“系统繁忙”，就知道今天又白忙",
  "朋友圈点赞的人，比回消息的多",
  "AI生成的PPT，比老板讲的还难懂",
  "春招简历投了50份，已读不回49次",
  "地铁挤到手机自动解锁，密码是1234",
  "健身卡办完，第一次去就遇到闭店通知",
  "天气预报说“局部有雨”，结果你家就是局部",
  "会议开了两小时，结论是‘再讨论’",
  "充电线弯折处，总在第3次弯时断",
  "截图时手一抖，把整个聊天记录发群里",
  "打开APP想查个东西，先看15秒开屏广告",
  "说好‘就吃一口’，结果吃完一整包薯片"
];

export default async function handler(req) {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  let topic = await kv.get(`topic:${today}`);

  if (!topic) {
    // 首次：用日期种子随机选题（保证同一天全球一致）
    const seed = (Number(today.replace(/-/g, '')) * 97) % TOPIC_BANK.length;
    topic = TOPIC_BANK[seed];
    await kv.set(`topic:${today}`, topic, { ex: 86400 }); // 缓存24h
  }

  return new Response(JSON.stringify({ topic }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
// api/submit.js — 接收回复，存入 KV
import { kv } from '@vercel/kv';

const BAD_WORDS = ['骂', '死', '滚', '操', '艹', '傻', '蠢', '垃圾', '尼玛', '他妈'];

function sanitize(text) {
  if (!text || text.trim().length === 0) return null;
  const clean = text.trim();
  for (let word of BAD_WORDS) {
    if (clean.includes(word)) return null;
  }
  return clean.length <= 100 ? clean : clean.substring(0, 100) + '…';
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { text } = await req.json();
    const clean = sanitize(text);
    if (!clean) {
      return new Response(JSON.stringify({ error: '内容包含不友善词汇' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const today = new Date().toISOString().split('T')[0];
    const id = Math.random().toString(36).substr(2, 9);
    const entry = { id, text: clean, ts: Date.now() };

    // 存入 replies 列表（追加）
    const key = `replies:${today}`;
    let list = await kv.get(key);
    list = list ? JSON.parse(list) : [];
    list.push(entry);
    await kv.set(key, JSON.stringify(list), { ex: 86400 });

    return new Response(JSON.stringify({ ok: true, id }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
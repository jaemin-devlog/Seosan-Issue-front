const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const express = require("express");
const cors = require("cors");

/** ← 백엔드 도메인만! (/api 붙이지 마세요) */
const TARGET = process.env.TARGET_API_BASE || "https://seosan-issue.shop";

const app = express();

/** 바디를 원문 그대로 전달(폼/이미지/JSON 등) */
app.use(express.raw({ type: "*/*" }));
app.use(cors({ origin: true }));

/** 헬스체크 */
app.get("/ping", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

/** /api/* → 백엔드 프록시 */
app.all("/*", async (req, res) => {
  try {
    // Hosting 리라이트 경로는 /api/... → /api 접두어 제거
    const upstreamPath = req.originalUrl.replace(/^\/api(?=\/|$)/, "") || "/";
    const url = `${TARGET}${upstreamPath}`;

    // 원본 헤더에서 문제가 될 수 있는 것 제거
    const headers = { ...req.headers };
    delete headers.host; delete headers.origin; delete headers.referer; delete headers.connection;

    const method = req.method;
    const body = (method === "GET" || method === "HEAD") ? undefined : req.body;

    const r = await fetch(url, { method, headers, body });

    // 응답 헤더 전달(불필요한 헤더 제외)
    const respHeaders = {};
    r.headers.forEach((v, k) => {
      if (k.toLowerCase() !== "transfer-encoding") respHeaders[k] = v;
    });

    res.status(r.status).set(respHeaders);
    const buf = Buffer.from(await r.arrayBuffer());
    res.send(buf);
  } catch (e) {
    logger.error(e);
    res.status(500).json({ ok: false, error: String(e) });
  }
});

/** 함수 이름은 반드시 'api' — firebase.json 의 rewrites 와 일치 */
exports.api = onRequest({ region: "asia-northeast3" }, app);

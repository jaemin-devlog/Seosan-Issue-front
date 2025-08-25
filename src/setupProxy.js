const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Flask 전용 프록시
  app.use(
    '/flask',
    createProxyMiddleware({
      target: 'https://seosan-issue.shop',
      changeOrigin: true,
      secure: false,
      timeout: 60000,
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying:', req.method, req.url, '->', req.url);
      }
    })
  );
app.use(
    "/api/v1/weather/ncst",
    createProxyMiddleware({
      target: "https://seosan-issue.shop",
      changeOrigin: true,
      // 일부 환경에서 TLS 이슈가 있을 수 있으니 개발에서는 꺼둠
      secure: false,
      logLevel: "debug",
      onError(err, req, res) {
        console.error("[proxy:/api/v1/weather/ncst] error:", err?.code || err);
        res.status(502).json({
          status: 502,
          message: "Proxy failed for /api/v1/weather/ncst",
          code: err?.code || "PROXY_ERROR",
        });
      },
    })
  );

  // 모든 /api 요청을 프록시
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://seosan-issue.shop',
      changeOrigin: true,
      secure: false,
      timeout: 60000,  // 타임아웃을 60초로 증가
      pathRewrite: function (path, req) {
        // Flask 엔드포인트
        if (path.startsWith('/api/flask')) {
          return path.replace('/api', '');
        }
        // posts 엔드포인트는 그대로 유지
        if (path.startsWith('/api/posts')) {
          return path;
        }
        // 나머지는 /api/v1로 변경
        return path.replace('/api', '/api/v1');
      },
      onProxyReq: (proxyReq, req, res) => {
        let finalPath;
        if (req.url.startsWith('/api/flask')) {
          finalPath = req.url.replace('/api', '');
        } else if (req.url.startsWith('/api/posts')) {
          finalPath = req.url;
        } else {
          finalPath = req.url.replace('/api', '/api/v1');
        }
        console.log('Proxying:', req.method, req.url, '->', finalPath);
        // Content-Length 헤더 제거
        proxyReq.removeHeader('content-length');
      },
      onProxyRes: (proxyRes, req, res) => {
        // Content-Length 헤더 제거 (응답에서도)
        delete proxyRes.headers['content-length'];
      },
      selfHandleResponse: false
    })
  );
};
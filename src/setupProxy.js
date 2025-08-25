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

  // explore/summary 엔드포인트 전용 프록시
  app.use(
    '/api/explore/summary',
    createProxyMiddleware({
      target: 'https://seosan-issue.shop',
      changeOrigin: true,
      secure: false,
      timeout: 60000,
      pathRewrite: {
        '^/api/explore/summary': '/api/v1/explore/summary'
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('Summary API Proxying:', req.method, req.url);
        
        // 요청 헤더 설정
        proxyReq.setHeader('origin', 'https://seosan-issue.shop');
        proxyReq.setHeader('referer', 'https://seosan-issue.shop/');
        
        // POST 요청 body 처리
        if (req.method === 'POST') {
          let bodyData = '';
          req.on('data', (chunk) => {
            bodyData += chunk;
          });
          req.on('end', () => {
            console.log('Request body:', bodyData);
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
            proxyReq.end();
          });
        }
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('Summary API Response:', proxyRes.statusCode);
        // CORS 헤더 추가
        proxyRes.headers['access-control-allow-origin'] = '*';
        proxyRes.headers['access-control-allow-methods'] = 'GET,PUT,POST,DELETE,OPTIONS';
        proxyRes.headers['access-control-allow-headers'] = 'Content-Type';
      }
    })
  );

  // 모든 /api 요청을 프록시
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://seosan-issue.shop',
      changeOrigin: true,
      secure: false,
      timeout: 60000,
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
      },
      onProxyRes: (proxyRes, req, res) => {
        // CORS 헤더 추가
        proxyRes.headers['access-control-allow-origin'] = '*';
      }
    })
  );
};
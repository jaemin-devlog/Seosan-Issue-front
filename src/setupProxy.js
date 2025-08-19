const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // 모든 /api 요청을 프록시
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://34.64.60.156:8083',
      changeOrigin: true,
      secure: false,
      timeout: 30000,
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
        console.log('Proxying:', req.method, req.url);
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
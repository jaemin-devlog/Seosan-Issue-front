const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Flask 엔드포인트 프록시
  app.use(
    '/flask',
    createProxyMiddleware({
      target: 'https://seosan-issue.shop',
      changeOrigin: true,
      secure: true,
      timeout: 30000,
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying Flask:', req.method, req.url);
      }
    })
  );
  
  // API 요청 프록시
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://seosan-issue.shop',
      changeOrigin: true,
      secure: true,
      timeout: 30000,
      pathRewrite: function (path, req) {
        // posts 엔드포인트는 그대로 유지
        if (path.startsWith('/api/posts')) {
          return path;
        }
        // weather/cards 엔드포인트
        if (path.startsWith('/api/weather/cards')) {
          return path.replace('/api', '/api/v1');
        }
        // 나머지는 /api/v1로 변경
        return path.replace('/api', '/api/v1');
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying API:', req.method, req.url);
      }
    })
  );
};
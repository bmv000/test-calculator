const {createProxyMiddleware}= require('http-proxy-middleware')
module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://consumer-api.development.dev.woltapi.com',
            changeOrigin: true,
        })
    )
}
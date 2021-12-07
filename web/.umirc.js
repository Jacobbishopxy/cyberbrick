export default {
    proxy: {
        '/gateway': {
            target: 'http://192.168.50.131:8010',
            changeOrigin: true,
            pathRewrite: { '^/gateway': '' },
            secure: false
        },
        '/api': {
            target: 'http://192.168.50.131:8030',
            changeOrigin: true,
            pathRewrite: { '^': '' },
            secure: false
        },
    }
}
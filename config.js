/**
 * 小程序配置文件
 */
var host = "127.0.0.1:8080"

var config = {

    host,

    // 测试的请求地址，用于测试会话
    requestUrl: 'http://${host}/api/v1/jwt/login',
    login_url: `http://${host}/api/v1/jwt/login`
};

module.exports = config
/**
 * 小程序配置文件
 */
var host = "bmc.huochexia.com"

var config = {

    host,

    // 测试的请求地址，用于测试会话
    requestUrl: 'http://${host}/business/api/v1/jwt/login',
    login_url: `http://${host}/business/api/v1/jwt/login`
};

module.exports = config
/**
 * 小程序配置文件
 */
var host = "bmc.huochexia.com"

var config = {
    host,
    // 测试的请求地址，用于测试会话
    login_url: `https://${host}/business/api/v1/jwt/login`,
    revenue_overall_url: `https://${host}/business/api/v1/gboard/revenue/overall/`,//营收整体收入
    revenue_project_url: `https://${host}/business/api/v1/gboard/revenue/project/`,//营收项目收入

    my_resources_url: `https://${host}/business/api/v1/gboard/resources/my/`
};

module.exports = config
/**
 * 小程序配置文件
 */
var host = "bmc.huochexia.com";

var config = {
    host,
    // 测试的请求地址，用于测试会话
    login_url: `https://${host}/business/api/v1/jwt/login`,
    revenue_overall_url: `https://${host}/business/api/v1/gboard/revenue/overall/`,//营收整体收入
    revenue_project_url: `https://${host}/business/api/v1/gboard/revenue/project/`,//营收项目收入
    finance_overall_url: `https://${host}/business/api/v1/gboard/finance/overall/`,//财务整体收入
    finance_project_url: `https://${host}/business/api/v1/gboard/finance/project/`,//财务项目收入
    resources_my_url: `https://${host}/business/api/v1/gboard/resources/my/`,//我的资源 车队
    resources_account_url: `https://${host}/business/api/v1/gboard/revenue/account/`,//我的资源账户
    CAR_TYPE: 
    { '1': '厢式车',
      '2': '平板车',
      '3': '高栏车',
     '4':'中栏车',
     '5':'低栏车',
     '6':'其他车型', 
     '7':'冷藏车',
     '8':'危险品车', 
     '9':'自卸货车',
     '10': '集装厢车', 
     '11':'高低板车' }
};
module.exports = config
// config to use param from .env file
require('dotenv').config();

let {NODE_ENV, PRODUCTION} = process.env;

const production = !!(NODE_ENV === 'production' && !!PRODUCTION);

global.production = production;

global.maintenance = false;
global.maintenance_message = 'Hệ thống bảo trì 1-2 phút, vui lòng chờ và thao tác lại*';
global.unknown_service_message = 'Server này chưa mở hoặc đang bảo trì*';
global.lucky_wheel_enable = false;

// Theme
global.theme_noel = false;
global.theme_tet = false;
global.theme_snow = false;
global.private_services = [];
global.requestStatistic = {};


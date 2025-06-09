// Set env to start wig (product only)
require('events').EventEmitter.defaultMaxListeners = 0;
const express = require('express');
const engine = require('ejs-mate');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const moment = require('moment');
const response = require('./lib/response');
const { listServicesByType } = require('./lib/constants');
const { serverMapping } = require('./enums/EnumServices');

// config to use param from .env file
require('dotenv').config();

let { PORT, NODE_ENV } = process.env;

let sessionExtra = {};

const FileStore = require('session-file-store')(session);
const fileStoreOptions = {};
sessionExtra.store = new FileStore(fileStoreOptions);

moment.locale('vi');
const app = express();

require('./lib/global');

app.locals.moment = moment;
app.locals.functions = require('./lib/functions');
app.locals.version = +new Date();

// variables for group services
let allGroupServices = Object.keys(serverMapping);

app.locals.logGroupService = allGroupServices.filter((row) => !row.match(/vip/));
app.locals.vipGroupService = allGroupServices.filter((row) => row.match(/vip/));
app.locals.listServicesByType = listServicesByType;

// view engine setup
app.set('views', __dirname + '/views');

app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use('/assets', express.static(__dirname + '/assets'));

// Set up body parser
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true, parameterLimit: 10000 }));

// Set up cookie
app.use(cookieParser('COOKIE_SECRET'));

app.use(async (req, res, next) => {
	res.jsonError = (...vars) => {
		return res.json(response.error(...vars));
	};

	res.jsonSuccess = (...vars) => {
		return res.json(response.success(...vars));
	};
	return next();
});

// Set up routes
app.use('/', require('./apps/controllers/panel'));
app.all('*', (req, res) => {
	if (req.url && (req.url === '/favicon.ico' || req.url.match(/^\/assets/))) return res.sendStatus(404);
	return res.redirect('/');
});

app.listen(PORT, () => {
	console.log(`Server started: http://localhost:${PORT} mode: ` + NODE_ENV.toUpperCase());
});

// Handle error (reason, promise)
process.on('unhandledRejection', (reason) => {
	if (reason) {
		console.error('App TypeError: Unhandled Rejection at:', reason.stack || reason);
	} else {
		console.error('App TypeError: Unhandled Rejection with no reason!');
	}

	// Recommended: send the information to sentry.io
	// or whatever crash reporting service you use
});

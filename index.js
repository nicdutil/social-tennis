// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone
var express = require('express'),
	app = express(),
	keystone = require('keystone').connect(app),
	i18n = require('i18next');


// Initialise keystone with your project's configuration.
// See http://dsyjs.com/guide/config for available options
// and documentation.
keystone.init({
	'name': 'social-tennis',
	'brand': 'social-tennis',
	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'compress': true,
	'view engine': 'jade',
	'sections': ['home'],
	'emails': 'templates/emails',
	'auto update': true,
	'session': true,
	'signout redirect': '/fr/home',
	'signin redirect': '/fr/home',
	'auth': true,
	'signin logo': '/keystone/images/logo.png',
	'user model': 'User',
	'cookie secret': ']>.N%h]>4H_e=(Sifsks!NUPe_tsv=qAGZbqNfI_`B%h:T^JL2r^~)GOdf3/-XU;',
	'model prefix': 'social-tennis',
	'mongo': process.env.MONGOHQ_URL,
	'mandrill api key': process.env.MANDRILL_API_KEY,
	'mandrill username': 'nicolas.dutil@infocinc.com'
});


keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});

// Load i18n options
var options = {
	ns: {
		namespaces: [
			'app', 'home'
		],
		defaultNs: 'app'
	},
	preload: ['en', 'fr'],
	supportedLngs: ['en', 'fr'],
	load: 'unspecific',
	resSetPath: 'locales/__lng__/__ns__.json',
	detectLngFromPath: 0,
	forceDetectLngFromPath: true,
	fallbackLng: 'fr',
	debug: true
};


// Load your project's Routes
keystone.set('routes', require('./routes'));


// Setup common locals for your emails. The following are required by keystone's
// default email templates, you may remove them if you're using your own.
keystone.set('email locals', {
	logo_src: '/images/logo-email.gif',
	logo_width: 194,
	logo_height: 76,
	theme: {
		email_bg: '#f9f9f9',
		link_color: '#2697de',
		buttons: {
			color: '#fff',
			background_color: '#2697de',
			border_color: '#1a7cb7'
		}
	}
});

// Setup replacement rules for emails, to automate the handling of differences
// between development a production.

// Be sure to update this rule to include your site's actual domain, and add
// other rules your email templates require.


if (keystone.get('env') === 'production') {
	keystone.set('secure signin', 'https://socialtennis.herokuapp.com/keystone/signin');
}

/*
keystone.set('email rules', [{
	find: '/images/',
	replace: keystone.get('env') === 'production' ? 'http://socialtennis.herokuapp.com/images/' : 'http://localhost:3000/images/'
}, {
	find: '/keystone/',
	replace: keystone.get('env') === 'production' ? 'http://socialtennis.herokuapp.com/keystone/' : 'http://localhost:3000/keystone/'
}]);

// Load your project's email test routes
keystone.set('email tests', require('./routes/emails'));
*/

// Configure the navigation bar in keystone's Admin UI
keystone.set('nav', {
	'posts': ['posts', 'post-categories'],
	'users': 'users',
	'images': 'images'
});

/*
if (keystone.get('env') === 'production') {
	keystone.set('signout redirect', 'http://www.infocinc.com/fr/home');
	keystone.set('back url', 'https://infocinc.herokuapp.com/fr/home');
	keystone.set('secure admin', 'https://infocinc.herokuapp.com');
}
*/

// Start keystone to connect to your database and initialise the web server
var events = {
	'onMount': function() {
		i18n.backend(require('./backend'));
		i18n.init(options);
		i18n.registerAppHelper(app);
	}
};
keystone.start(events);



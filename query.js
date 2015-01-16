var http = require('http'),
	request = require('request'),
	fs = require('fs'),
	prettyjson = require('prettyjson'),
	cheerio = require('cheerio');

var options = {
	hostname: 'http://www.ausopen.com',
	port: 80,
	path: '/en_AU/scores/draws/ms/'
};

var urlPrefix = options.hostname + options.path,
	pageNames = [
		'r1s1', 'r1s2', 'r1s3', 'r1s4',
		'r2s1', 'r2s2', 'r3s1', 'r4s1',
		'r5s1', 'r6s1', 'r7s1'
	],
	pageName = pageNames.shift(),
	matches = [],
	players = {};


function toUrl(pageName) {
	return urlPrefix.concat(pageName, '.html');
};


function nextPage() {
	if (pageName = pageNames.shift()) {
		queryMatches(toUrl(pageName));
	} else {
		try {
			fs.writeFile('./matches', JSON.stringify(matches), function(err) {
				if (err) throw err;
			});
		} catch (e) {
			console.log(e);
		}
	};
};


function queryMatches(url) {
	request(url, function(err, res, html) {

		if (!err && res.statusCode == 200) {
			var $ = cheerio.load(html);
			var arr = [];
			$('[id^=match]').each(function() {
				var p = [];
				$(this).find('.sc').each(function() {
					p.push($(this).text());
				});
				var match = {
					'receiving': p[0],
					'visiting': p[1]
				};
				matches.push(match);
			});

			nextPage();
		}
	});
}

function queryDraw(url) {
	request(url, function(err, res, html) {

		if (!err && res.statusCode == 200) {
			var $ = cheerio.load(html);
			var arr = [];
			$('.sc').each(function() {
				var name = $(this).text().trim();
				players[name] = {
					'href': $(this).attr('href')
				};
				if (name.toLowerCase() !== 'qualifier') {
					request(options.hostname + players[name].href, function(err, res, html) {
						if (!err && res.statusCode == 200) {
							var $ = cheerio.load(html);
							$('.rank').each(function(index, element) {
								if (index === 0) {
									players[name].rank = $(this).text();
								}
							});
						}
					});
				}
			});
			nextPage();
		}
	});
};



(function main() {
	queryMatches(toUrl(pageName))
})();

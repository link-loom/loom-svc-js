function search(dependencies) {

	const _database = dependencies.database;
	const _cross = dependencies.cross;

    /**
     * Refer to: https://moz.com/learn/seo/robotstxt and https://support.google.com/webmasters/answer/6062596?hl=en
     * @param {*} req 
     * @param {*} res 
     */
	const robots = function (req, res) {
		res.type('text/plain');
		res.send(`
# You know, for robots
#
# robots@server.com

User-agent: *

Sitemap: https://www.server.com/sitemap/master.xml
Sitemap: https://www.server.com/sitemap/latest.xml

Disallow: */api/*`);
	}

    /**
     * Refer to: https://developers.google.com/webmasters/videosearch/sitemaps
     * @param {*} req 
     * @param {*} res 
     */
	const sitemapMaster = function (req, res) {
		var xmlContents = '<some-fancy-xml></some-fancy-xml>';
		res.type('text/xml');
		res.send(`<?xml version="1.0" encoding="utf-8"?>
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
		${xmlContents}
		</urlset>`);
	}

	const sitemapLatest = function (req, res) {
		var xmlContents = '<some-fancy-xml></some-fancy-xml>';
		res.type('text/xml');
		res.send(`<?xml version="1.0" encoding="utf-8"?>
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
		${xmlContents}
		</urlset>`);
	}

	return {
		robots: robots,
		sitemapMaster: sitemapMaster,
		sitemapLatest: sitemapLatest,
	}
}

module.exports = search;
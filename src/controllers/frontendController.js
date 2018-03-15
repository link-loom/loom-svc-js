function FrontEnd(dependencies) {
	
		const home = require(`${dependencies.root}/src/routes/frontend/home`)(dependencies);
		const seo = require(`${dependencies.root}/src/routes/frontend/seo`)(dependencies);
		const maintenance = require(`${dependencies.root}/src/routes/frontend/maintenance`)(dependencies);
	
		/// Dependencies
		const _console = dependencies.console;
		const _app = dependencies.httpServer;
		const _express = dependencies.express;
		const _path = dependencies.path;
	
		const constructor = () => {
			buildFrontendViews();
		}
	
		const buildFrontendViews = () => {
			/// Setup React engine for Express
			_app.set('views', `${dependencies.root}/src/views`);
			_app.set('view engine', 'jsx');
			_app.engine('jsx', require('express-react-views').createEngine());
	
			/// Setup routes for views
			_app.get('/', home.index);
			/* _app.get('/about', about.index);
			_app.get('/search/', search.index); */
	
			/// SEO routes
			_app.get('/robots.txt', seo.robots);
			_app.get('/sitemap/master.xml', seo.sitemapMaster);
			_app.get('/sitemap/latest.xml', seo.sitemapLatest);
	
			// publish all files under public folder
			_app.use(_express.static(_path.join(dependencies.root, '/public')));
	
			// Something else, 404 error
			_app.get('*', maintenance.index);
	
			_console.success('Boilerplate', 'FrontEnd module initialized');
		}
	
		return {
			Initialize: constructor
		}
	}
	
	module.exports = FrontEnd;

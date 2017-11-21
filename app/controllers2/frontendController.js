function FrontEnd(dependencies) {
	
		const home = require(`${dependencies.root}/routes/frontend/home`)(dependencies);
		const seo = require(`${dependencies.root}/routes/frontend/seo`)(dependencies);
		const maintenance = require(`${dependencies.root}/routes/frontend/maintenance`)(dependencies);
		/* const watch = require(`${dependencies.root}/routes/frontend/watch`)(dependencies);
		const about = require(`${dependencies.root}/routes/frontend/about`)(dependencies); */
	
		/// Dependencies
		const _console = dependencies.console;
		const _app = dependencies.app;
		const _express = dependencies.express;
		const _path = dependencies.path;
	
		const constructor = () => {
			buildFrontendViews();
		}
	
		const buildFrontendViews = () => {
			/// Setup React engine for Express
			_app.set('views', `${dependencies.root}/views`);
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
	
			_console.success('xbase', 'FrontEnd module initialized');
		}
	
		return {
			Initialize: constructor
		}
	}
	
	module.exports = FrontEnd;
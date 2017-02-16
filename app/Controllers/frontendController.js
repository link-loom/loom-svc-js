function FrontEnd(dependencies){

    /// Dependencies
    var _console;
    var _app;
    var _express;
	var _path;

    var constructor = function(){
        _app            = dependencies.app;
        _express        = dependencies.express;
        _path           = dependencies.path;
        _console        = dependencies.console;

        generateFrontEnd(); 
    }

    var generateFrontEnd = function(){
        /// Basic configuration
        _app.engine('html', require('ejs').renderFile);
        _app.set("view options", {layout: false});
        
        _app.use(_express.static(_path.join(__dirname, '../../www/'))); //  "public" off of current is root
        
        _app.get('/', function(req, res){
            res.render("index.html");
        });
        _console.log('FrontEnd module initialized', 'server-success');
    }

    return {
        Initialize: constructor
    }
}

module.exports = FrontEnd;
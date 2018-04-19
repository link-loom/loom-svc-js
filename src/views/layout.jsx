const React = require('react');
const PropTypes = require('prop-types');

class Layout extends React.Component {
  render () {
    return (
      <html lang="en">

        <head>
          <title>Boilerplate {this.props.title !== undefined ? ' - ' + this.props.title : ''}</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <meta name="keywords" content="some, words, about, this, project" />
          <meta name="description" content="Awesome boilerplate to create node.js projects" />

          <link rel="apple-touch-icon" sizes="57x57" href="https://boilerplate-node.com/assets/img/apple-icon-57x57.png" />
          <link rel="apple-touch-icon" sizes="60x60" href="https://boilerplate-node.com/assets/img/apple-icon-60x60.png" />
          <link rel="apple-touch-icon" sizes="72x72" href="https://boilerplate-node.com/assets/img/apple-icon-72x72.png" />
          <link rel="apple-touch-icon" sizes="76x76" href="https://boilerplate-node.com/assets/img/apple-icon-76x76.png" />
          <link rel="apple-touch-icon" sizes="114x114" href="https://boilerplate-node.com/assets/img/apple-icon-114x114.png" />
          <link rel="apple-touch-icon" sizes="120x120" href="https://boilerplate-node.com/assets/img/apple-icon-120x120.png" />
          <link rel="apple-touch-icon" sizes="144x144" href="https://boilerplate-node.com/assets/img/apple-icon-144x144.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="https://boilerplate-node.com/assets/img/apple-icon-152x152.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="https://boilerplate-node.com/assets/img/apple-icon-180x180.png" />
          <link rel="icon" type="image/png" sizes="192x192" href="https://boilerplate-node.com/assets/img/android-icon-192x192.png?v=2" />
          <link rel="icon" type="image/png" sizes="32x32" href="https://boilerplate-node.com/assets/img/favicon-32x32.png?v=2" />
          <link rel="icon" type="image/png" sizes="96x96" href="https://boilerplate-node.com/assets/img/favicon-96x96.png?v=2" />
          <link rel="icon" type="image/png" sizes="16x16" href="https://boilerplate-node.com/assets/img/favicon-16x16.png?v=2" />
          <link rel="manifest" href="https://boilerplate-node.com/assets/img/manifest.json" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="msapplication-TileImage" content="https://boilerplate-node.com/assets/img/ms-icon-144x144.png" />
          <meta name="theme-color" content="#ffffff" />


          {/* Schema.org markup for Google+ */}
          <meta itemProp="name" content="The X Base" />
          <meta itemProp="description" content="Awesome boilerplate to create node.js projects" />
          <meta itemProp="image" content="https://boilerplate-node.com/assets/img/FacebookBanner.jpg" />
          {/* Twitter Card data */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="&#64;boilerplate-node" />
          <meta name="twitter:title" content="The X Base" />
          <meta name="twitter:description" content="Awesome boilerplate to create node.js projects" />
          <meta name="twitter:creator" content="&#64;boilerplate-node" />
          <meta name="twitter:image" content="https://boilerplate-node.com/assets/img/FacebookBanner.jpg" />
          {/* Open Graph data */}
          <meta property="og:title" content="The X Base" />
          <meta property="og:type" content="product" />
          <meta property="og:url" content="https://boilerplate-node.com/" />
          <meta property="og:image" content="https://boilerplate-node.com/assets/img/FacebookBanner.jpg" />
          <meta property="og:description" content="Awesome boilerplate to create node.js projects" />
          <meta property="og:site_name" content="The X Base" />

          <link href="/bootstrap/css/bootstrap.min.css" rel="stylesheet" />

          <link href="/css/main.css" rel="stylesheet" />

        </head>

        <body>
          <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
            <a class="navbar-brand" href="#">Beat</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarsExampleDefault">
              <ul class="navbar-nav mr-auto">
                <li class="nav-item active">
                  <a class="nav-link" href="/">Home <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="https://github.com/thEpisode/beat/wiki">Documentation</a>
                </li>
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="https://github.com/thEpisode/beat" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Another projects</a>
                  <div class="dropdown-menu" aria-labelledby="dropdown01">
                    <a class="dropdown-item" href="https://www.virtualcapitalofamerica.com" target="_blank">Virtual capital of America</a>
                    <a class="dropdown-item" href="https://github.com/thEpisode/Linux-Shellcode-Generator" target="_blank">Linux Shellcode Generator</a>
                    <a class="dropdown-item" href="https://github.com/virtualcapitalofamerica/secret-sharing.js" target="_blank">secret-sharing.js</a>
                    <a class="dropdown-item" href="https://github.com/virtualcapitalofamerica/Firebase-DotNet" target="_blank">Firebase-DotNet</a>
                    <a class="dropdown-item" href="https://github.com/bioverflow/Dobermann" target="_blank">cracker-trap</a>
                    <a class="dropdown-item" href="https://github.com/bioverflow/cracker-trap" target="_blank">Dobermann</a>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
          <div className="content-body">
            {/* Start Content */}
            {this.props.children}
            {/* End Content */}
          </div>

          <script src="/jquery/jquery.slim.min.js"></script>
          <script src="/bootstrap/js/bootstrap.min.js"></script>

        </body>

      </html>
    );
  }
}

module.exports = Layout;

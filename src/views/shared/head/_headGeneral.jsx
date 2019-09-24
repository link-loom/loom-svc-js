const React = require('react');
const PropTypes = require('prop-types');

class Head extends React.Component {
  render () {
    return (
      <head>
        <title>{`${this.props.title} -` || ''} %BEAT%</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="keywords" content="some, words, about, this, project" />
        <meta name="description" content="%BEAT% is an awesome project created with node.js" />

        <link rel="apple-touch-icon" sizes="57x57" href="https://%BEAT%-node.com/assets/img/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="https://%BEAT%-node.com/assets/img/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="https://%BEAT%-node.com/assets/img/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="https://%BEAT%-node.com/assets/img/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="https://%BEAT%-node.com/assets/img/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="https://%BEAT%-node.com/assets/img/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="https://%BEAT%-node.com/assets/img/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="https://%BEAT%-node.com/assets/img/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://%BEAT%-node.com/assets/img/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="https://%BEAT%-node.com/assets/img/android-icon-192x192.png?v=2" />
        <link rel="icon" type="image/png" sizes="32x32" href="https://%BEAT%-node.com/assets/img/favicon-32x32.png?v=2" />
        <link rel="icon" type="image/png" sizes="96x96" href="https://%BEAT%-node.com/assets/img/favicon-96x96.png?v=2" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://%BEAT%-node.com/assets/img/favicon-16x16.png?v=2" />
        <link rel="manifest" href="https://%BEAT%-node.com/assets/img/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="https://%BEAT%-node.com/assets/img/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />

        {/* Schema.org markup for Google+ */}
        <meta itemProp="name" content="%BEAT%" />
        <meta itemProp="description" content="%BEAT% is an awesome project created with node.js" />
        <meta itemProp="image" content="https://%BEAT%-node.com/assets/img/FacebookBanner.jpg" />
        {/* Twitter Card data */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="&#64;%BEAT%-node" />
        <meta name="twitter:title" content="%BEAT%" />
        <meta name="twitter:description" content="%BEAT% is an awesome project created with node.js" />
        <meta name="twitter:creator" content="&#64;%BEAT%-node" />
        <meta name="twitter:image" content="https://%BEAT%-node.com/assets/img/FacebookBanner.jpg" />
        {/* Open Graph data */}
        <meta property="og:title" content="%BEAT%" />
        <meta property="og:type" content="product" />
        <meta property="og:url" content="https://%BEAT%-node.com/" />
        <meta property="og:image" content="https://%BEAT%-node.com/assets/img/FacebookBanner.jpg" />
        <meta property="og:description" content="%BEAT% is an awesome project created with node.js" />
        <meta property="og:site_name" content="%BEAT%" />

        {/* Vue */}
        <script src="/vue/vue.js"></script>
        <script src="/vue-resource/vue-resource.min.js"></script>
        <script src="/vue-cookies/vue-cookies.js"></script>

        <link href="https://fonts.googleapis.com/css?family=Work+Sans:100,200,300,400,500,600,700,800,900" rel="stylesheet"></link>

        <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/css/main.css" />
        <link rel="stylesheet" href="/css/animate.css" />
        <link rel="stylesheet" href="/sweetalert2/sweetalert2.min.css"></link>
        <link rel="stylesheet" href="css/icomoon.css"></link>

      </head>
    );
  }
}

module.exports = Head;

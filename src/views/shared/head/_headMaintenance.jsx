const React = require('react');
const PropTypes = require('prop-types');

class Head extends React.Component {
  render () {
    return (

      <head>
        <title>{`${this.props.title} -` || ''} Virtual capital of America</title>
        <meta charSet="utf-8" />

        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="keywords" content="blockchain, cryptocurrencies, bitcoin, ethereum, wallet" />
        <meta name="description" content="Improving the way we live" />

        <link rel="apple-touch-icon" sizes="57x57" href="https://www.virtualcapitalofamerica.com/assets/img/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="https://www.virtualcapitalofamerica.com/assets/img/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="https://www.virtualcapitalofamerica.com/assets/img/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="https://www.virtualcapitalofamerica.com/assets/img/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="https://www.virtualcapitalofamerica.com/assets/img/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="https://www.virtualcapitalofamerica.com/assets/img/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="https://www.virtualcapitalofamerica.com/assets/img/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="https://www.virtualcapitalofamerica.com/assets/img/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://www.virtualcapitalofamerica.com/assets/img/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="https://www.virtualcapitalofamerica.com/assets/img/android-icon-192x192.png?v=2" />
        <link rel="icon" type="image/png" sizes="32x32" href="https://www.virtualcapitalofamerica.com/assets/img/favicon-32x32.png?v=2" />
        <link rel="icon" type="image/png" sizes="96x96" href="https://www.virtualcapitalofamerica.com/assets/img/favicon-96x96.png?v=2" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://www.virtualcapitalofamerica.com/assets/img/favicon-16x16.png?v=2" />
        <link rel="manifest" href="https://www.virtualcapitalofamerica.com/assets/img/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="https://www.virtualcapitalofamerica.com/assets/img/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />


        {/* Schema.org markup for Google+ */}
        <meta itemProp="name" content="Virtual capital of America" />
        <meta itemProp="description" content="Improving the way we live" />
        <meta itemProp="image" content="https://www.virtualcapitalofamerica.com/assets/img/FacebookBanner.jpg" />
        {/* Twitter Card data */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="&#64;Virtual capital of America-node" />
        <meta name="twitter:title" content="Virtual capital of America" />
        <meta name="twitter:description" content="Improving the way we live" />
        <meta name="twitter:creator" content="&#64;Virtual capital of America-node" />
        <meta name="twitter:image" content="https://www.virtualcapitalofamerica.com/assets/img/FacebookBanner.jpg" />
        {/* Open Graph data */}
        <meta property="og:title" content="Virtual capital of America" />
        <meta property="og:type" content="product" />
        <meta property="og:url" content="https://www.virtualcapitalofamerica.com/" />
        <meta property="og:image" content="https://www.virtualcapitalofamerica.com/assets/img/FacebookBanner.jpg" />
        <meta property="og:description" content="Improving the way we live" />
        <meta property="og:site_name" content="Virtual capital of America" />

        <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/vue-resource@1.5.0"></script>
        <script src="https://unpkg.com/vue-cookies@1.5.5/vue-cookies.js"></script>

        <link href="/bootstrap/css/bootstrap.min.css" rel="stylesheet" />

        <link href="/css/main.css" rel="stylesheet" />

        <link rel="stylesheet" href="/sweetalert2/sweetalert2.min.css"></link>

      </head>
    );
  }
}

module.exports = Head;

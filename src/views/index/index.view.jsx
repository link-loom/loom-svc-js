const React = require('react');
const PropTypes = require('prop-types');
const Layout = require('../layout');

class Index extends React.Component {
  render () {

    return (
      <Layout {...this.props}>
        <section class="jumbotron text-center">
          <div class="container">
            <h1 class="jumbotron-heading">Beat</h1>
            <p class="lead text-muted">Server framework for your Node.js projects made with Express, Firebase and ReactDOM.</p>
            <a href="#" class="btn btn-primary my-2 mx-2">Documentation</a>
            <a href="#" class="btn btn-secondary my-2 mx-2">beat-cli</a>
          </div>
        </section>
      </Layout>
    );
  }
}

module.exports = Index;

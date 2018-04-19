const React = require('react');
const PropTypes = require('prop-types');
const Layout = require('../layout');

class Index extends React.Component {
  render () {

    return (
      <Layout {...this.props}>
        <section class="jumbotron text-center">
          <div class="container">
            <h1 class="jumbotron-heading">%BEAT% project</h1>
            <p class="lead text-muted">Server framework for your Node.js projects made with Express, Firebase and ReactDOM.</p>
            <a href="https://github.com/thEpisode/beat/wiki" class="btn btn-primary my-2 mx-2" target="_blank">Documentation</a>
            <a href="https://github.com/thEpisode/beat-cli" class="btn btn-secondary my-2 mx-2" target="_blank">beat-cli</a>
          </div>
        </section>
      </Layout>
    );
  }
}

module.exports = Index;

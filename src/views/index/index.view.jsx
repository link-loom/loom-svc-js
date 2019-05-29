const React = require('react');
const PropTypes = require('prop-types');
const Layout = require('../shared/layouts/_layoutGeneral');

class Index extends React.Component {
  render () {

    return (
      <Layout {...this.props}>
        <section className="jumbotron text-center">
          <div className="container">
            <h1 className="jumbotron-heading">%BEAT% project</h1>
            <p className="lead text-muted">Server framework for your Node.js projects made with Express, Firebase and ReactDOM.</p>
            <a href="https://github.com/thEpisode/beat/wiki" className="btn btn-primary my-2 mx-2" target="_blank">Documentation</a>
            <a href="https://github.com/thEpisode/beat-cli" className="btn btn-secondary my-2 mx-2" target="_blank">beat-cli</a>
          </div>
        </section>
      </Layout>
    );
  }
}

module.exports = Index;

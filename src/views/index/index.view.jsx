const React = require('react');
const PropTypes = require('prop-types');
const Layout = require('../shared/layouts/_layoutPublic');

class Index extends React.Component {
  render () {

    return (
      <Layout {...this.props}>
        <section className="hero-wrap js-fullheight">
          <div className="overlay"></div>
          <div className="container">
            <div className="row no-gutters slider-text js-fullheight align-items-center justify-content-center">
              <div className="col-md-9 text-center">
                <h1 className="mb-3 bread">%BEAT%</h1>
                <p className="breadcrumbs"><span><a href="https://github.com/thEpisode/beat/wiki">Documentation</a></span></p>
              </div>
            </div>
          </div>
        </section>

        <section className="ftco-section d-md-flex bg-light">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-10 text-center">
                <h2>Server framework for your Node.js projects made with Express, Firebase and ReactDOM.</h2>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }
}

module.exports = Index;

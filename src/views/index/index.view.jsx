const React = require('react');
const PropTypes = require('prop-types');
const Layout = require('../shared/layouts/_layoutGeneral');

class Index extends React.Component {
  render () {

    return (
      <Layout {...this.props}>
        <section class="hero-wrap js-fullheight">
          <div class="overlay"></div>
          <div class="container">
            <div class="row no-gutters slider-text js-fullheight align-items-center justify-content-center">
              <div class="col-md-9 text-center">
                <h1 class="mb-3 bread">About Beat project</h1>
                <p class="breadcrumbs"><span class="mr-2"><a href="https://github.com/thEpisode/beat-cli">Home</a></span> <span><a href="https://github.com/thEpisode/beat/wiki">Documentation</a></span></p>
              </div>
            </div>
          </div>
        </section>

        <section class="ftco-section d-md-flex bg-light">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-md-10 text-center">
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

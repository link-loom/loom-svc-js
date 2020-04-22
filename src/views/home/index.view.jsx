const React = require('react');
const PropTypes = require('prop-types');
const Layout = require('../shared/layouts/_layoutPublic');

class Index extends React.Component {
  render () {

    return (
      <Layout {...this.props}>
        <section className="d-flex align-items-center hero-wrap">
          <div className="overlay"></div>
          <div className="container">
            <div className="row no-gutters slider-text align-items-center justify-content-center">
              <div className="col-md-9 text-center">
                <h1 className="mb-3 bread">{this.props.data.locale.MAIN_TITLE_LABEL}</h1>
                <p className="breadcrumbs"><span><a href="https://github.com/thEpisode/beat/wiki">{this.props.data.locale.MAIN_DESCRIPTION_LABEL}</a></span></p>
              </div>
            </div>
          </div>
        </section>

        <section className="ftco-section d-md-flex bg-light">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-10 text-center">
                <h2>{this.props.data.locale.SECOND_DESCRIPTION_LABEL}</h2>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }
}

module.exports = Index;

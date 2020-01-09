const React = require('react');
const PropTypes = require('prop-types');
const Layout = require('../shared/layouts/_layoutError');
const Footer = require('../shared/footer/_footerError');

class Index extends React.Component {
  render () {
    return (
      <Layout {...this.props}>
        <div className="col-lg-7 mx-auto text-white">
          <div className="row align-items-center d-flex flex-row">
            <div className="col-lg-6 text-lg-right pr-lg-4">
              <h1 className="display-1 mb-0">{'{{vueBind.model.code}}'}</h1>
            </div>
            <div className="col-lg-6 error-page-divider text-lg-left pl-lg-4">
              <h2>{this.props.data.locale.MAIN_SUBTITLE}</h2>
              <h3 className="h3 font-weight-light">{this.props.data.locale.MAIN_MESSAGE_LABEL}</h3>
              <pre className="error-message" v-if="vueBind.model.error">{'{{vueBind.model.error}}'}: {'{{vueBind.model.message}}'}</pre>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-12 text-center mt-xl-2">
              <a className="text-white font-weight-medium" href="/">{this.props.data.locale.MAIN_BACK_LINK}</a>
            </div>
          </div>

          <Footer {...this.props} />
        </div>
      </Layout>
    );
  }
}

module.exports = Index;

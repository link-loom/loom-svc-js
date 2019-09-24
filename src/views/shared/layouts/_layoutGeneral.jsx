const React = require('react');
const PropTypes = require('prop-types');

const LayoutHead = require('../head/_headGeneral')
const TopNavigation = require('../navigation/_navGeneral')
const Footer = require('../footer/_footerGeneral')

class Layout extends React.Component {
  render () {
    return (
      <html lang="en">

        <LayoutHead {...this.props} />

        <body>

          <section id="vue-app" className="h-100 w-100">
            <TopNavigation {...this.props} />

            {/* Start Content */}
            {this.props.children}
            {/* End Content */}

            <Footer {...this.props} />
          </section>

          <section className="pwa-prompt banner-bottom-center">
            <div className="d-flex flex-row justify-content-center position-relative">
              <div className="d-flex align-items-center col-6">
                <div className="ath-banner-cell">
                  <img width="48" src="/img/favicon.svg" alt="PWA Installer icon" className="ath-prompt-logo" />
                </div>
                <p className="w-100">Do you want install Mi Retail?</p>
              </div>
              <div className="d-flex align-items-center justify-content-end col-6">
                <button className="btn btn-notnow btn-outline-light btn-fw mx-2">Not Now</button>
                <button className="btn btn-install btn-warning mx-2">Install</button>
              </div>
            </div>
          </section>

          <div id="ftco-loader" className="loader show fullscreen"><svg className="circular" width="48px" height="48px">
            <circle className="path-bg" cx="24" cy="24" r="22" fill="none" strokeWidth="4" stroke="#eeeeee" />
            <circle className="path" cx="24" cy="24" r="22" fill="none" strokeWidth="4" strokeMiterlimit="10"
              stroke="#F96D00" /></svg>
          </div>

          <script type="text/javascript" src="/jquery/jquery.slim.min.js"></script>
          <script type="text/javascript" src="/popperjs/umd/popper.min.js"></script>
          <script type="text/javascript" src="/bootstrap/js/bootstrap.min.js"></script>
          <script type="text/javascript" src="/sweetalert2/sweetalert2.min.js"></script>

          <script type="text/javascript" {...{ 'src': this.props.vue ? `/private/vue/${this.props.vue}` : '' }}></script>

          <script type="text/javascript" src="/js/scripts.js"></script>

          <script type="text/javascript" src="/pwa.js"></script>
          {/* FIXME: If you want to be a PWA installable */}
          {/* <script type="text/javascript" src="/pwa/pwa-installer.js"></script> */}

        </body>

      </html>
    );
  }
}

module.exports = Layout;

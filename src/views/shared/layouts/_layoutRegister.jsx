const React = require('react');
const PropTypes = require('prop-types');

const LayoutHead = require('../head/_headRegister')
const TopNavigation = require('../navigation/_navRegister')
const Footer = require('../footer/_footerRegister')

class Layout extends React.Component {
  render () {
    const vueServices = []

    for (const [index, value] of this.props.data.services.entries()) {
      vueServices.push(<script type="text/javascript" key={index} src={'/private/vue/' + value}></script>)
    }

    return (
      <html lang="en">

        <LayoutHead {...this.props} />

        <body>

          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" className="blur-svg">
            <defs>
              <filter id="blur-filter">
                <feGaussianBlur stdDeviation="3"></feGaussianBlur>
              </filter>
            </defs>
          </svg>

          <div id="vue-app" className="container-scroller">

            <div className="container-scroller">
              <div className="container-fluid page-body-wrapper full-page-wrapper">
                <div className="content-wrapper d-flex align-items-center auth bg-light register-bg">
                  <TopNavigation {...this.props} />

                  {/* Start Content */}
                  {this.props.children}
                  {/* End Content */}

                  {/* <Footer {...this.props} /> */}

                </div>
              </div>
            </div>
          </div>

          <div id="loader" className="loader show fullscreen">
            <svg className="circular" width="48px" height="48px">
              <circle className="path-bg" cx="24" cy="24" r="22" fill="none" strokeWidth="4" stroke="#eeeeee" />
              <circle className="path" cx="24" cy="24" r="22" fill="none" strokeWidth="4" strokeMiterlimit="10"
                stroke="#2f395d" />
            </svg>
          </div>

          {/* Scripts */}
          <script type="text/javascript" src="/jquery/jquery.slim.min.js"></script>
          <script type="text/javascript" src="/popperjs/umd/popper.min.js"></script>
          <script type="text/javascript" src="/bootstrap/js/bootstrap.min.js"></script>
          <script type="text/javascript" src="/sweetalert2/sweetalert2.min.js"></script>
          <script type="text/javascript" src="/select2/js/select2.min.js"></script>

          <script type="text/javascript" src="/private/js/scripts.js"></script>

          <script type="text/javascript" src="/private/vue/_mixins/m-parameters.js"></script>
          <script type="text/javascript" src="/private/vue/_mixins/m-popup.js"></script>
          <script type="text/javascript" src="/private/vue/_mixins/m-b64.js"></script>
          <script type="text/javascript" src="/private/vue/_mixins/m-format.js"></script>
          <script type="text/javascript" src="/private/vue/_mixins/m-time.js"></script>
          <script type="text/javascript" src="/private/vue/_mixins/m-auth.js"></script>
          <script type="text/javascript" src="/private/vue/_mixins/m-find.js"></script>
          <script type="text/javascript" src="/private/vue/_mixins/m-localization.js"></script>
          <script type="text/javascript" src="/private/vue/_mixins/m-loader.js"></script>

          {vueServices}
          <script type="text/javascript" {...{ 'src': this.props.vue ? `/vue/${this.props.vue}` : '' }}></script>

          <script type="text/javascript" src="/pwa.js"></script>
        </body>

      </html>
    );
  }
}

module.exports = Layout;

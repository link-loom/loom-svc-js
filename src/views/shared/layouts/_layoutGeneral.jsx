const React = require('react');
const PropTypes = require('prop-types');

const LayoutHead = require('../head/_headGeneral')
const TopNavigation = require('../navigation/_navGeneral')
const Footer = require('../footer/_footerGeneral')

class Layout extends React.Component {
  render () {
    const vueBinding = {
      attr: {
        vueSrc: { 'src': this.props.vue ? `/js/vue/${this.props.vue}` : '' }
      }
    }

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

          <div id="ftco-loader" class="show fullscreen"><svg class="circular" width="48px" height="48px">
            <circle class="path-bg" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke="#eeeeee" />
            <circle class="path" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke-miterlimit="10"
              stroke="#F96D00" /></svg>
          </div>

          <script type="text/javascript" src="/jquery/jquery.slim.min.js"></script>
          <script type="text/javascript" src="/popperjs/umd/popper.min.js"></script>
          <script type="text/javascript" src="/bootstrap/js/bootstrap.min.js"></script>
          <script type="text/javascript" src="/sweetalert2/sweetalert2.min.js"></script>

          <script type="text/javascript" {...vueBinding.attr.vueSrc}></script>

          <script type="text/javascript" src="/js/scripts.js"></script>

        </body>

      </html>
    );
  }
}

module.exports = Layout;

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

          <section id="vue-app">
            <TopNavigation {...this.props} />

            <div className="body-container container-fluid page-body-wrapper">
              {/* Start Content */}
              {this.props.children}
              {/* End Content */}
            </div>

            <Footer {...this.props} />
          </section>

          <script type="text/javascript" src="/jquery/jquery.slim.min.js"></script>
          <script type="text/javascript" src="/popperjs/umd/popper.min.js"></script>
          <script type="text/javascript" src="/bootstrap/js/bootstrap.min.js"></script>
          <script type="text/javascript" src="/sweetalert2/sweetalert2.min.js"></script>

          <script type="text/javascript" {...vueBinding.attr.vueSrc}></script>

        </body>

      </html>
    );
  }
}

module.exports = Layout;

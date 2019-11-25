const React = require('react');
const PropTypes = require('prop-types');

const LayoutHead = require('../head/_headError')
const Navigation = require('../navigation/_navError')
const Footer = require('../footer/_footerError')

class Layout extends React.Component {
  render () {
    let vueBinding = {
      attr: {
        vueSrc: { 'src': this.props.vue ? `/js/vue/${this.props.vue}` : '' }
      }
    }
    return (
      <html lang="en">

        <LayoutHead {...this.props} />

        <body>
          <section id="vue-app" className="h-100">
            <Navigation {...this.props} />

            <div className="content-body">
              {/* Start Content */}
              {this.props.children}
              {/* End Content */}
            </div>

            <Footer {...this.props} />
          </section>


          <script src="/jquery/jquery.slim.min.js"></script>
          <script src="/bootstrap/js/bootstrap.min.js"></script>

          <script src="/js/scripts.js"></script>>

          <script {...vueBinding.attr.vueSrc}></script>

        </body>

      </html>
    );
  }
}

module.exports = Layout;

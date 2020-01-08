const React = require('react');
const PropTypes = require('prop-types');

const LayoutHead = require('../head/_headError')
const Navigation = require('../navigation/_navError')
const Footer = require('../footer/_footerError')

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

          <script src="/js/scripts.js"></script>

          <script type="text/javascript" src="/private/vue/_mixins/m-popup.js"></script>
          <script type="text/javascript" src="/private/vue/_mixins/m-b64.js"></script>
          <script type="text/javascript" src="/private/vue/_mixins/m-format.js"></script>
          <script type="text/javascript" src="/private/vue/_mixins/m-time.js"></script>
          <script type="text/javascript" src="/private/vue/_mixins/m-auth.js"></script>
          <script type="text/javascript" src="/private/vue/_mixins/m-find.js"></script>
          <script type="text/javascript" src="/private/vue/_mixins/m-localization.js"></script>
          <script type="text/javascript" src="/private/vue/_mixins/m-loader.js"></script>
          <script type="text/javascript" src="/private/vue/_mixins/m-parameters.js"></script>

          <script type="text/javascript" src="/private/vue/_components/c-selectable.js"></script>
          <script type="text/javascript" src="/private/vue/_components/c-wizard.js"></script>
          {vueServices}
          <script type="text/javascript" {...{ 'src': this.props.vue ? `/private/vue/${this.props.vue}` : '' }}></script>

        </body>

      </html>
    );
  }
}

module.exports = Layout;

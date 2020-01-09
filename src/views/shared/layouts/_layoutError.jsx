const React = require('react');
const PropTypes = require('prop-types');

const LayoutHead = require('../head/_headError')

class Layout extends React.Component {
  render () {
    const vueServices = []

    for (const [index, value] of this.props.data.services.entries()) {
      vueServices.push(<script type="text/javascript" key={index} src={'/vue/' + value}></script>)
    }

    return (
      <html lang="en">

        <LayoutHead {...this.props} />

        <body className="sidebar-fixed">

          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" className="blur-svg">
            <defs>
              <filter id="blur-filter">
                <feGaussianBlur stdDeviation="3"></feGaussianBlur>
              </filter>
            </defs>
          </svg>

          <section id="vue-app" className="h-100">
            <div className="container-fluid page-body-wrapper full-page-wrapper">

              <div className="content-wrapper d-flex align-items-center text-center error-page bg-primary">
                <div className="row flex-grow">
                  {/* Start Content */}
                  {this.props.children}
                  {/* End Content */}
                </div>
              </div>
            </div>

          </section>


          <script src="/jquery/jquery.slim.min.js"></script>
          <script src="/bootstrap/js/bootstrap.min.js"></script>

          <script src="/js/scripts.js"></script>

          <script type="text/javascript" src="/vue/_mixins/m-popup.js"></script>
          <script type="text/javascript" src="/vue/_mixins/m-b64.js"></script>
          <script type="text/javascript" src="/vue/_mixins/m-format.js"></script>
          <script type="text/javascript" src="/vue/_mixins/m-time.js"></script>
          <script type="text/javascript" src="/vue/_mixins/m-auth.js"></script>
          <script type="text/javascript" src="/vue/_mixins/m-find.js"></script>
          <script type="text/javascript" src="/vue/_mixins/m-localization.js"></script>
          <script type="text/javascript" src="/vue/_mixins/m-loader.js"></script>
          <script type="text/javascript" src="/vue/_mixins/m-parameters.js"></script>

          <script type="text/javascript" src="/vue/_components/c-selectable.js"></script>
          <script type="text/javascript" src="/vue/_components/c-wizard.js"></script>
          {vueServices}
          <script type="text/javascript" {...{ 'src': this.props.vue ? `/vue/${this.props.vue}` : '' }}></script>

        </body>

      </html>
    );
  }
}

module.exports = Layout;

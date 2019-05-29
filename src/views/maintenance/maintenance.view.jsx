const React = require('react');
const PropTypes = require('prop-types');
const Layout = require('../shared/layouts/_layoutMaintenance');

class Index extends React.Component {
  render() {
    return (
      <Layout {...this.props}>
        <div className="error-404">Something was wrong</div>
      </Layout>
    );
  }
}

module.exports = Index;

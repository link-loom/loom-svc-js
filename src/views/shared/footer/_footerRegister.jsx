const React = require('react');
const PropTypes = require('prop-types');

class Footer extends React.Component {
  render () {
    const date = new Date()
    return (
      <div>
        <div className="col-lg-6 login-half-bg d-flex flex-row">
          <p className="text-white font-weight-medium text-center flex-grow align-self-end">Copyright Virtual capital of America &copy; {date.getFullYear()}  All rights reserved.</p>
        </div>
      </div>
    );
  }
}

module.exports = Footer;

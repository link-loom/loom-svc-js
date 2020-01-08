const React = require('react');
const PropTypes = require('prop-types');

class Footer extends React.Component {
  render () {
    const date = new Date()
    return (

      <div className="col-lg-6 login-half-bg d-flex flex-row">
        <p className="text-white font-weight-medium text-center flex-grow align-self-end">%BEAT%™ is a trademark used under license. <a href="https://www.virtualcapitalofamerica.com/" target="_blank" className="text-white">VCA Ventures</a> Copyright &copy; {date.getFullYear()}  All rights reserved.</p>
      </div>

    );
  }
}

module.exports = Footer;

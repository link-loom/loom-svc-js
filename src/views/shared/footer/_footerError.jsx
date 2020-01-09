const React = require('react');
const PropTypes = require('prop-types');

class Footer extends React.Component {
  render () {
    const date = new Date()
    return (

      <footer className="row mt-5">
        <div className="col-12 mt-xl-2">
          <span className="text-white font-weight-medium text-center">Copyright © {date.getFullYear()} <a href="https://www.virtualcapitalofamerica.com/" target="_blank" className="text-white">Virtual capital of America</a>. All rights reserved.</span>
        </div>

        <div className="col-12 mt-xl-2">
          <span className="text-white font-weight-medium text-center">Help <i className="mdi mdi-comment-question text-info"></i></span>
        </div>
      </footer>

    );
  }
}

module.exports = Footer;

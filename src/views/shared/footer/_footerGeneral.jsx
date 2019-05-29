const React = require('react');
const PropTypes = require('prop-types');

class Footer extends React.Component {
  render () {
    let date = new Date()
    return (

      <footer className="footer d-none d-lg-block">
        <div className="d-sm-flex justify-content-center justify-content-sm-between">
          <span className="text-muted text-center text-sm-left d-block d-sm-inline-block">Copyright © {date.getFullYear()} <a href="https://www.virtualcapitalofamerica.com/" target="_blank" className="text-muted">Virtual capital of America</a>. All rights reserved.</span>
          <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center text-muted">Help <i className="mdi mdi-comment-question text-info"></i></span>
        </div>
      </footer>

    );
  }
}

module.exports = Footer;

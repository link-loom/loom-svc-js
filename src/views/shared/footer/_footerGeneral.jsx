const React = require('react');
const PropTypes = require('prop-types');

class Footer extends React.Component {
  render () {
    let date = new Date()
    return (
      <footer className="ftco-footer ftco-section img">
        <div className="overlay"></div>
        <div className="container">
          <div className="row mb-5">
            <div className="col-lg-3 col-md-6 mb-5 mb-md-5">
              <div className="ftco-footer-widget mb-4">
                <h1 className="logo">%BEAT%</h1>
              </div>
            </div>
            <div className="col-lg col-md-6 mb-5 mb-md-5 ">
              <div className="ftco-footer-widget mb-4">
                <h2 className="location">Virtual capital of America</h2>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-5 mb-md-5">
              <div className="ftco-footer-widget mb-4">
                <ul className="ftco-footer-social list-unstyled float-md-left float-lft">
                  <li className=""><a href="https://twitter.com/vca_global"><span className="icon-twitter"></span></a></li>
                  <li className=""><a href="https://www.facebook.com/virtualcapitalofamerica/"><span className="icon-facebook"></span></a></li>
                  <li className=""><a href="https://www.instagram.com/virtualcapitalofamerica/"><span className="icon-instagram"></span></a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 text-center">
              <p className="">
                Copyright © {date.getFullYear()} <a href="https://www.virtualcapitalofamerica.com/" target="_blank">
                  Virtual capital of America</a>. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

    );
  }
}

module.exports = Footer;

const React = require('react');
const PropTypes = require('prop-types');

class Footer extends React.Component {
  render () {
    let date = new Date()
    return (
      <footer class="ftco-footer ftco-section img">
        <div class="overlay"></div>
        <div class="container">
          <div class="row mb-5">
            <div class="col-lg-3 col-md-6 mb-5 mb-md-5">
              <div class="ftco-footer-widget mb-4">
                <h1 class="logo">%BEAT%</h1>
              </div>
            </div>
            <div class="col-lg col-md-6 mb-5 mb-md-5 ">
              <div class="ftco-footer-widget mb-4">
                <h2 class="location">Virtual capital of America</h2>
              </div>
            </div>
            <div class="col-lg-3 col-md-6 mb-5 mb-md-5">
              <div class="ftco-footer-widget mb-4">
                <ul class="ftco-footer-social list-unstyled float-md-left float-lft">
                  <li class=""><a href="https://twitter.com/vca_global"><span class="icon-twitter"></span></a></li>
                  <li class=""><a href="https://www.facebook.com/virtualcapitalofamerica/"><span class="icon-facebook"></span></a></li>
                  <li class=""><a href="https://www.instagram.com/virtualcapitalofamerica/"><span class="icon-instagram"></span></a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 text-center">
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

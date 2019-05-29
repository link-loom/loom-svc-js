const React = require('react');
const PropTypes = require('prop-types');

class NavigationHeader extends React.Component {

  render () {
    let bindings = {
      style: {
        hasNewNotifications: { 'v-bind:class': '{ "alert-animation-active": vueBind.model.notifications && vueBind.model.notifications.length > 0 }' },
      }
    }
    return (
      <nav class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
        <div class="container">
          <a class="navbar-brand" href="/">%BEAT%</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse"
            data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="oi oi-menu"></span> Menu
          </button>
          <div class="collapse navbar-collapse" id="ftco-nav">
            <ul class="navbar-nav ml-auto">
              <li class="nav-item active"><a href="/" class="nav-link">Home</a></li>
              <li class="nav-item"><a href="https://github.com/thEpisode/beat/wiki" class="nav-link">Documentation</a></li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="https://github.com/thEpisode/beat" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Another projects</a>
                <div className="dropdown-menu" aria-labelledby="dropdown01">
                  <a className="dropdown-item" href="https://www.virtualcapitalofamerica.com" target="_blank">Virtual capital of America</a>
                  <a className="dropdown-item" href="https://github.com/thEpisode/Linux-Shellcode-Generator" target="_blank">Linux Shellcode Generator</a>
                  <a className="dropdown-item" href="https://github.com/virtualcapitalofamerica/secret-sharing.js" target="_blank">secret-sharing.js</a>
                  <a className="dropdown-item" href="https://github.com/bioverflow/cracker-trap" target="_blank">cracker-trap</a>
                  <a className="dropdown-item" href="https://github.com/bioverflow/Dobermann" target="_blank">Dobermann</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

module.exports = NavigationHeader;

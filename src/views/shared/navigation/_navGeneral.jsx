const React = require('react');
const PropTypes = require('prop-types');

class NavigationHeader extends React.Component {

  render () {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
        <div className="container">
          <a className="navbar-brand" href="/">%BEAT%</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse"
            data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="oi oi-menu"></span> Menu
          </button>
          <div className="collapse navbar-collapse" id="ftco-nav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item active"><a href="/" className="nav-link">Home</a></li>
              <li className="nav-item"><a href="https://github.com/thEpisode/beat/wiki" className="nav-link">Documentation</a></li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="https://github.com/thEpisode/beat" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Another projects</a>
                <div className="dropdown-menu" aria-labelledby="dropdown01">
                  <a className="dropdown-item" href="https://www.virtualcapitalofamerica.com" target="_blank">Virtual capital of America</a>
                  <a className="dropdown-item" href="https://miretail.com.co" target="_blank">Mi Retail</a>
                  <a className="dropdown-item" href="https://gobot.site" target="_blank">Go Bot</a>
                  <a className="dropdown-item" href="https://intelagroiot.com" target="_blank">Intelsense</a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="https://github.com/thEpisode/Linux-Shellcode-Generator" target="_blank">Linux Shellcode Generator</a>
                  <a className="dropdown-item" href="https://github.com/virtualcapitalofamerica/secret-sharing.js" target="_blank">secret-sharing.js</a>
                  <a className="dropdown-item" href="https://github.com/bioverflow/cracker-trap" target="_blank">cracker-trap</a>
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

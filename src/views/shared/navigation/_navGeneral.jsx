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
      <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
        <a className="navbar-brand" href="#">%BEAT%</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarsExampleDefault">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://github.com/thEpisode/beat/wiki">Documentation</a>
            </li>
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
      </nav>
    )
  }
}

module.exports = NavigationHeader;

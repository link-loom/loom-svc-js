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
      <nav className="nav">
        {/* TODO */}
      </nav>
    )
  }
}

module.exports = NavigationHeader;

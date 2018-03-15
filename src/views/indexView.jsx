const React = require('react');
const PropTypes = require('prop-types');
const Layout = require('./layout');

function getCurrentYear(): string {
	return (new Date).getFullYear();
}

class Index extends React.Component {
	render() {
		
		return (
			<Layout {...this.props}>
				<h1>Hello, this is a home page</h1>
			</Layout>
		);
	}
}

module.exports = Index;
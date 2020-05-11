const React = require('react');
const PropTypes = require('prop-types');
const Layout = require('./../shared/_someLayout');

class Index extends React.Component {
  render () {
    return (
      <Layout {...this.props}>

        <div className="row">
          <div className="col-12 col-lg-8 grid-margin mx-auto d-block">
            <div className="card">
              <div className="card-body">
                <div className="container pt-2">
                  <h4 className="card-title">{this.props.data.locale.MAIN_TITLE_LABEL}</h4>
                  <p className="card-description">{this.props.data.locale.MAIN_DESCRIPTION_LABEL}</p>
                  <button className="btn btn-primary mr-2">[Call to action]</button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </Layout>
    );
  }
}

module.exports = Index;

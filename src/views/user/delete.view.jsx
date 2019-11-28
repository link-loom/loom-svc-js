const React = require('react');
const PropTypes = require('prop-types');
const Layout = require('../shared/layouts/_layoutGeneral');

class Index extends React.Component {
  render () {
    return (
      <Layout {...this.props}>

        <div className="row">
          <div className="col-12 col-lg-8 grid-margin mx-auto d-block">
            <div className="card">
              <div className="card-body">
                <div className="container pt-2 text-center">
                  <h2 className="mb-3">{this.props.data.locale.MAIN_TITLE_LABEL} {'{{vueBind.model.entity.firstname}}'}</h2>
                  <p className="card-description">{this.props.data.locale.MAIN_DESCRIPTION_LABEL}</p>
                  <button
                    {...{ 'v-on:click': 'deleteOnClick($event)' }}
                    className="btn btn-danger mr-2">{this.props.data.locale.MAIN_DELETE_BUTTON}</button>
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

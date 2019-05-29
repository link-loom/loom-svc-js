const React = require('react');
const PropTypes = require('prop-types');
const Layout = require('../shared/layouts/_neoBankLayout');

class Index extends React.Component {
  render () {
    let bindings = {
      attr: {},
      events: {},
      model: {},
      lists: {},
      style: {},
      visibility: {}
    }

    return (
      <Layout {...this.props}>

        <div className="row">
          <div className="col-12 col-md-8 grid-margin stretch-card d-flex justify-content-center mx-auto d-block">
            <div className="card">
              <div className="card-body">
                <div className="container text-center pt-2">
                  <h2 className="mb-3">[Title]</h2>
                  <p className="w-75 mx-auto mb-5">[Text]</p>
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

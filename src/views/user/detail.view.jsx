const React = require('react');
const PropTypes = require('prop-types');
const Layout = require('../shared/layouts/_layoutGeneral');

class Index extends React.Component {
  render () {
    return (
      <Layout {...this.props}>

        <div className="row">

          <div className="col-md-5 grid-margin grid-margin-md-0 stretch-card mx-auto d-block">
            <div className="card">
              <div className="card-body text-center">
                <div className="mb-4">
                  <img src="https://via.placeholder.com/92x92" className="img-lg rounded-circle mb-2" alt="profile image" />
                  <h4>{'{{vueBind.model.entity.firstname}}'} {'{{vueBind.model.entity.lastname}}'}</h4>
                  <p className="text-muted mb-0">{'{{vueBind.model.entity.role.title}}'}</p>
                </div>
                <p className="mt-4 card-text"></p>
                <button className="btn btn-info btn-sm mt-3 mb-4">{'{{vueBind.model.entity.status.title}}'}</button>
                <div className="border-top pt-3">
                  <div className="row">
                    <div className="col-4">
                      <h6>{`{{vueBind.model.entity.last_login || '-'}}`}</h6>
                      <p>{this.props.data.locale.DETAIL_LAST_LOGIN_LABEL}</p>
                    </div>
                    <div className="col-4">
                      <h6>{`{{vueBind.model.entity.last_time_on_app || '-'}}`}</h6>
                      <p>{this.props.data.locale.DETAIL_LAST_TIME_LABEL}</p>
                    </div>
                    <div className="col-4">
                      <h6>{`{{vueBind.model.entity.phone || '-'}}`}</h6>
                      <p>{this.props.data.locale.DETAIL_PHONE_LABEL}</p>
                    </div>
                  </div>
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

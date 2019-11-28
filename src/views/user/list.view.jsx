const React = require('react');
const PropTypes = require('prop-types');
const Layout = require('../shared/layouts/_layoutGeneral');

class Index extends React.Component {
  render () {
    return (
      <Layout {...this.props}>

        <div className="row">
          <div className="col-12 grid-margin mx-auto d-block">
            <div className="card">
              <div className="card-body">
                <div className="pt-2">

                  <article className="border-bottom mb-3 d-flex">
                    <h4 className="card-title mt-3 pl-3 mr-auto">{this.props.data.locale.MAIN_TITLE_LABEL}</h4>
                    <p className="">{this.props.data.locale.MAIN_DESCRIPTION_LABEL}</p>
                    <a href="/user/create/" className="btn btn-primary my-2 mr-3">{this.props.data.locale.MAIN_CREATE_BUTTON}</a>
                    <a href="/user/bulk" className="btn btn-primary my-2 mr-3">{this.props.data.locale.MAIN_BULK_LABEL}</a>
                  </article>

                  <div className="table-responsive mt-3">
                    <table id="order-listing" className="table">
                      <thead>
                        <tr>
                          <th>{this.props.data.locale.TABLE_ID_TH}</th>
                          <th>{this.props.data.locale.TABLE_EMAIL_TH}</th>
                          <th>{this.props.data.locale.TABLE_NAME_TH}</th>
                          <th>{this.props.data.locale.TABLE_ROLE_TH}</th>
                          <th>{this.props.data.locale.TABLE_ROPORT_TH}</th>
                          <th>{this.props.data.locale.TABLE_LOGIN_TH}</th>
                          <th>{this.props.data.locale.TABLE_STATUS_TH}</th>
                          <th>{this.props.data.locale.TABLE_ACTIONS_TH}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="_entity in vueBind.model.entities">
                          <td>{'{{_entity.id}}'}</td>
                          <td>{'{{_entity.email}}'}</td>
                          <td>{`{{_entity.firstname}}`} {'{{_entity.lastname}}'}</td>
                          <td>{'{{_entity.role.title}}'}</td>
                          <td>{'{{_entity.boss_entity_id}}'}</td>
                          <td>{'{{_entity.last_login}}'}</td>
                          <td>
                            <label className="badge badge-info">{'{{_entity.status.title}}'}</label>
                          </td>
                          <td>
                            <a
                              {...{ 'v-bind:href': '"/user/detail?id=" + _entity.id' }}
                              className="btn btn-outline-secondary btn-rounded btn-icon mx-1 p-0 position-relative">
                              <i className="icon-link icon-magnifier text-primary"></i>
                            </a>
                            <a
                              {...{ 'v-bind:href': '"/user/edit?id=" + _entity.id' }}
                              className="btn btn-outline-secondary btn-rounded btn-icon mx-1 p-0 position-relative">
                              <i className="icon-link ti-pencil text-primary"></i>
                            </a>
                            <a
                              {...{ 'v-bind:href': '"/user/block?id=" + _entity.id' }}
                              className="btn btn-outline-secondary btn-rounded btn-icon mx-1 p-0 position-relative">
                              <i className="icon-link ti-na text-primary"></i>
                            </a>
                            <a
                              {...{ 'v-bind:href': '"/user/delete?id=" + _entity.id' }}
                              className="btn btn-outline-secondary btn-rounded btn-icon mx-1 p-0 position-relative">
                              <i className="icon-link ti-close text-danger"></i>
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
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

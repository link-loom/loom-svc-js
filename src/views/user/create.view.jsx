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
                <div className="container pt-2">
                  <h4 className="card-title">{this.props.data.locale.MAIN_TITLE_LABEL}</h4>
                  <p className="card-description">{this.props.data.locale.MAIN_DESCRIPTION_LABEL}</p>

                  <form>
                    <div className="form-row">
                      <div className=" form-group col-12 col-md-6">
                        <label className="form-control-label">{this.props.data.locale.FORM_FIRSTNAME_LABEL}</label>
                        <input
                          v-model="vueBind.model.entity.firstname"
                          type="text" autoComplete="off" className="form-control" id="name" placeholder="" />
                      </div>
                      <div className=" form-group col-12 col-md-6">
                        <label className="form-control-label">{this.props.data.locale.FORM_LASTNAME_LABEL}</label>
                        <input v-model="vueBind.model.entity.lastname"
                          type="text" autoComplete="off" className="form-control" id="lastname" placeholder="" />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className=" form-group col-12 col-md-6">
                        <label className="form-control-label">{this.props.data.locale.FORM_IDENTITY_LABEL}</label>
                        <input
                          v-model="vueBind.model.entity.identity"
                          type="number" autoComplete="off" className="form-control" id="dni" placeholder={this.props.data.locale.FORM_IDENTITY_PLACEHOLDER}/>
                      </div>
                      <div className=" form-group col-12 col-md-6">
                        <label className="form-control-label">{this.props.data.locale.FORM_EMAIL_LABEL}</label>
                        <input
                          v-model="vueBind.model.entity.email"
                          type="email" autoComplete="off" className="form-control" id="email" placeholder={this.props.data.locale.FORM_EMAIL_PLACEHOLDER} />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className=" form-group col-12 col-md-6">
                        <label className="form-control-label">{this.props.data.locale.FORM_PASSWORD_LABEL}</label>
                        <input v-model="vueBind.model.entity.password"
                          type="email" autoComplete="off" className="form-control" id="email" placeholder="" />
                      </div>
                      <div className=" form-group col-12 col-md-6">
                        <label className="form-control-label">{this.props.data.locale.FORM_BOSS_LABEL}</label>
                        <input
                          v-model="vueBind.model.entity.boss_user_id"
                          type="text" autoComplete="off" className="form-control" id="reportsto" placeholder={this.props.data.locale.FORM_BOSS_PLACEHOLDER}/>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className=" form-group col-12 col-md-6">
                        <label className="form-control-label">{this.props.data.locale.FORM_POSITION_LABEL}</label>
                        <input
                          v-model="vueBind.model.entity.job_title"
                          type="text" autoComplete="off" className="form-control" id="jobtitle" placeholder="Eg: Cashier" />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className=" form-group col-12">
                        <label className="form-control-label">{this.props.data.locale.ROLE_SELECT_LABEL}</label>
                        <div className="col-12 mt-2 row d-flex justify-content-center">

                          <button
                            v-for="_role in vueBind.model.roles"
                            {...{ 'v-bind:class': '{ selected: vueBind.model.entity.role.id === _role.id }' }}
                            {...{ 'v-on:click': 'selectRoleOnClick($event, _role)' }}
                            type="button" className="btn btn-outline-secondary btn-icon-text mx-1 my-2" >
                            <img src="/img/test/starter/employee.svg" alt="User role" className="icon mr-2" />
                            <span className="text">{'{{_role.title}}'}</span>
                          </button>

                        </div>
                      </div>
                    </div>

                    <button
                      {...{ 'v-on:click': 'returnOnClick($event)' }}
                      title="Cancel" type="button" className="btn btn-danger btn-action mr-2">
                      <i className="ti-close mr-2"></i> {this.props.data.locale.FORM_CANCEL_BUTTON}
                    </button>
                    <button {...{ 'v-on:click': 'createUserOnClick($event)' }}
                      title="Submit" type="submit" className="btn btn-primary btn-action ml-2">
                      <i className="ti-save mr-2"></i> {this.props.data.locale.FORM_CREATE_BUTTON}
                    </button>
                  </form>
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

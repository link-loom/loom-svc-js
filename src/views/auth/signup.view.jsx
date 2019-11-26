const React = require('react');
const PropTypes = require('prop-types');
const Layout = require('../shared/layouts/_layoutRegister');

class Index extends React.Component {

  render () {
    return (
      <Layout {...this.props}>

        <div className="row w-100">
          <div className="col-12 col-lg-6 col-xl-6 mr-auto">
            <div className="auth-form-light text-left p-4">
              <div className="brand-logo">
                <img src="/img/logo.svg" alt="logo" />
              </div>
              <h2 className="text-center">{this.props.data.locale.MAIN_TITLE_LABEL}</h2>
              <h6 className="font-weight-light text-center">{this.props.data.locale.MAIN_DESCRIPTION_LABEL}</h6>
              <form className="pt-3 px-md-5">
                <div className="form-row">
                  <div className="form-group col-12 mb-2 col-lg-6">
                    <label htmlFor="firstname">{this.props.data.locale.FORM_NAME_LABEL}</label>
                    <input
                      v-model="vueBind.model.user.firstname"
                      type="text" className="form-control form-control-lg" id="firstname"
                      placeholder={this.props.data.locale.FORM_NAME_PLACEHOLDER} />
                  </div>
                  <div className="form-group col-12 mb-2 col-lg-6">
                    <label htmlFor="lastname">{this.props.data.locale.FORM_LAST_NAME_LABEL}</label>
                    <input
                      v-model="vueBind.model.user.lastname"
                      type="text" className="form-control form-control-lg" id="lastname"
                      placeholder={this.props.data.locale.FORM_LAST_NAME_PLACEHOLDER} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-12 mb-2 col-lg-6">
                    <label htmlFor="phone">{this.props.data.locale.FORM_PHONECOUNTRY_LABEL}</label>
                    <select className="countries-list w-100">
                      <option
                        v-for="_country in vueBind.model.countries"
                        {...{ 'v-bind:value': '_country.calling_code' }}>{'{{_country.country}}'}</option>
                    </select>
                  </div>
                  <div className="form-group col-12 mb-2 col-lg-6">
                    <label htmlFor="phone">{this.props.data.locale.FORM_PHONE_LABEL}</label>
                    <input
                      v-model="vueBind.model.user.phone"
                      type="tel" className="form-control form-control-lg" id="phone"
                      placeholder={this.props.data.locale.FORM_PHONE_PLACEHOLDER} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-12 mb-2">
                    <label htmlFor="email">{this.props.data.locale.FORM_EMAIL_LABEL}</label>
                    <input
                      v-model="vueBind.model.user.email"
                      type="email" className="form-control form-control-lg" id="email" name="email"
                      placeholder={this.props.data.locale.FORM_EMAIL_PLACEHOLDER} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-12 mb-2">
                    <label htmlFor="password">{this.props.data.locale.FORM_PASSWORD_LABEL}</label>
                    <input
                      v-model="vueBind.model.user.password"
                      type="password" className="form-control form-control-lg" id="password" name="password"
                      placeholder={this.props.data.locale.FORM_PASSWORD_PLACEHOLDER} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="mb-1">
                    <div className="form-check">
                      <label className="form-check-label text-muted">
                        <input
                          v-model="vueBind.model.user.accept_terms"
                          type="checkbox" className="form-check-input" />
                        {this.props.data.locale.FORM_AGREE_TERMS_LABEL}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-1">
                  <button
                    {...{ 'v-on:click': 'createUserOnClick($event)' }}
                    className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn">{this.props.data.locale.FORM_GET_STARTED_BUTTON_BUTTON}</button>
                </div>
                <div className="text-center mt-4 font-weight-light">
                  {this.props.data.locale.FORM_QUESTION_ACCOUNT_LABEL}<a href="/login" className="text-primary">{this.props.data.locale.FORM_LOGIN_LINK}</a>
                </div>
              </form>
            </div>
          </div>
        </div>

      </Layout>
    );
  }
}

module.exports = Index;

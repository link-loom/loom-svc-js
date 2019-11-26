const React = require('react');
const PropTypes = require('prop-types');
const Layout = require('../shared/layouts/_layoutLogin');

class Index extends React.Component {

  render () {

    return (
      <Layout {...this.props}>

        <div className="col-lg-6 d-flex align-items-center justify-content-center">
          <div className="auth-form-transparent text-left p-3">
            <div className="brand-logo">
              <img src="/img/logo.svg" alt="logo" />
            </div>
            <h4>{this.props.data.locale.MAIN_TITLE_LABEL}</h4>
            <h6 className="font-weight-light">{this.props.data.locale.MAIN_MESSAGE_LABEL}</h6>
            <form className="pt-3">

              <div className="form-group">
                <label htmlFor="input-username">{this.props.data.locale.SIGNIN_USER_LABEL}</label>
                <div className="input-group">
                  <div className="input-group-prepend bg-transparent">
                    <span className="input-group-text bg-transparent border-right-0">
                      <i className="mdi mdi-account-outline text-primary"></i>
                    </span>
                  </div>
                  <input
                    v-model="vueBind.model.identity"
                    {...{ 'v-on:keyup.enter': 'loginOnClick($event)' }}
                    type="email"
                    className="form-control form-control-lg border-left-0"
                    id="input-username" placeholder={this.props.data.locale.SIGNIN_USER_PLACEHOLDER} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="input-password">{this.props.data.locale.SIGNIN_PASSWORD_LABEL}</label>
                <div className="input-group">
                  <div className="input-group-prepend bg-transparent">
                    <span className="input-group-text bg-transparent border-right-0">
                      <i className="mdi mdi-lock-outline text-primary"></i>
                    </span>
                  </div>
                  <input
                    v-model="vueBind.model.password"
                    {...{ 'v-on:keyup.enter': 'loginOnClick($event)' }}
                    type="password"
                    className="form-control form-control-lg border-left-0"
                    id="input-password" placeholder={this.props.data.locale.SIGNIN_PASSWORD_PLACEHOLDER} />
                </div>
              </div>

              <div className="my-2 d-flex justify-content-between align-items-center">
                <div className="form-check">
                  <label className="form-check-label text-muted">
                    <input type="checkbox" className="form-check-input" />
                    {this.props.data.locale.SIGNIN_KEEP_SIGNED_CHECK}
                    </label>
                </div>
                <a href="#" className="auth-link text-black">{this.props.data.locale.SIGNIN_RECOVER_ACOUNT_LABEL}</a>
              </div>
              <div className="my-3">
                <button
                  {...{ 'v-on:click': 'loginOnClick($event)' }}
                  type="submit"
                  className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn">{this.props.data.locale.SIGNIN_LOGIN_BUTTON}</button>
              </div>

              <div className="text-center mt-4 font-weight-light">
              {this.props.data.locale.ACCOUNT_QUESTION_CREATE_LABEL} <a href="/signup" className="text-primary">{this.props.data.locale.ACCOUNT_ACCOUNT_CREATE_LABEL}</a>
              </div>
            </form>
          </div>
        </div>

      </Layout>
    );
  }
}

module.exports = Index;

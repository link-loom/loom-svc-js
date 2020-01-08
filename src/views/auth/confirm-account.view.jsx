const React = require('react');
const PropTypes = require('prop-types');
const Layout = require('../shared/layouts/_layoutRegister');

class Index extends React.Component {
  render () {

    return (
      <Layout {...this.props}>

        <div className="row flex-grow">
          <div className="col-12 col-lg-8 grid-margin mx-auto d-block">
            <div className="card">
              <div className="card-body">
                <div className="container pt-2">
                  <img src="/img/logo.svg" alt="Logo" className="logo mx-auto mb-0" />
                  <img src="/img/email-en-route-v1.svg" alt="Logo" className="logo mx-auto d-block mt-1 mb-3" height="85" />
                  <h2 className="text-center text-primary">{this.props.data.locale.MAIN_TITLE_LABEL}</h2>
                  <p className="text-center card-description mb-1">{this.props.data.locale.MAIN_DESCRIPTION_CHECK_INBOX_LABEL}</p>
                  <p className="text-center card-description">{this.props.data.locale.MAIN_DESCRIPTION_ACTIVATE_LABEL}</p>
                  <div className="col-12 text-center mb-4">
                    <p>
                      <a {...{ 'v-bind:href': '"https://wa.me/573058126314?text=Activate%account"' }}
                        target="_blank" className="btn btn-social-icon-text btn-hangouts">
                        <i className="mdi mdi-whatsapp"></i> {this.props.data.locale.ACTIVATE_OPEN_WHATSAPP_BUTTON}</a>
                    </p>
                    <p className="card-description ml-3">{this.props.data.locale.ACTIVATE_ACCOUNT_LABEL}</p>
                  </div>
                  <div className="col-8 mx-auto">
                    <hr />
                  </div>

                  <div className="col-12 text-center mt-5 mb-3">
                    <a href="/login" className="btn btn-primary btn-lg">{this.props.data.locale.ACTIVATE_OPEN_STORE}</a>
                  </div>

                  <p className="card-description text-center">{this.props.data.locale.ACTIVATE_QUESTION_EMAIL_LABEL}
                  <a
                      {...{ 'v-on:click': 'sendEmailAgainOnClick($event)' }} href="#">{this.props.data.locale.ACTIVATE_SEND_EMAIL_LABEL}</a></p>
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

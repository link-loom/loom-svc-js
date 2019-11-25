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

                  <section className="form">
                    <div className="form-group">
                      <label htmlFor="receiver">{this.props.data.locale.FORM_RECEIVER_LABEL}</label>
                      <select id="receiver" className="users-list form-control">
                        <option disabled selected value="0">{this.props.data.locale.FORM_SELECT_PLACEHOLDER}</option>
                        <option
                          {...{ 'v-bind:value': '_user.id' }}
                          v-for="_user in vueBind.model.users">{'{{_user.firstname}}'} {'{{_user.lastname}}'}, {'{{phoneNumber(_user.phone)}}'}</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="subject">{this.props.data.locale.FORM_LONG_TITLE_LABEL}</label>
                      <input
                        v-model="vueBind.model.notification.subject"
                        type="text" name="short-title" id="short-title" required autoComplete="off" className="form-control" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="message">{this.props.data.locale.FORM_MESSAGE_LABEL}</label>
                      <div className="text-editor"></div>
                    </div>
                    <div>
                      <button
                        {...{ 'v-on:click': 'sendMessageOnClick($event)' }}
                        className="btn btn-primary">{this.props.data.locale.FORM_SEND_BUTTON}</button>
                    </div>
                  </section>
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

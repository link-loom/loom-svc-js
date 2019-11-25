const React = require('react');
const PropTypes = require('prop-types');
const Layout = require('../shared/layouts/_layoutGeneral');

class Index extends React.Component {
  render () {
    return (
      <Layout {...this.props}>

        <div className="email-wrapper d-flex wrapper">
          <div className="row align-items-stretch flex-grow-1">
            {/* Sidebar */}
            <div className="mail-sidebar col-md-2 pr-0 d-none d-lg-block pt-3 bg-white h-100 border-right"
              v-if="vueBind.model.notifications && vueBind.model.notifications.length > 0">
              <div className="menu-bar">
                <ul className="menu-items">
                  <li className="compose m-3">
                    <a href="/notification/compose" className="btn btn-primary btn-block text-white">
                      {this.props.data.locale.SIDE_COMPOSE_BUTTON}</a>
                  </li>
                  <li
                    v-for="_folder in vueBind.model.notificationsList"
                    {...{ 'v-bind:class': "{'active': _folder.name === vueBind.model.notificationFolderSelected.name }" }}>
                    <a href="#" className="w-100 d-flex"
                      {...{ 'v-on:click': 'selectFolder($event, _folder.name)' }}>
                      <i className="mdi"
                        {...{ 'v-bind:class': "_folder.icon" }}></i>
                      <span className="message_text">{'{{_folder.title}}'}</span>
                    </a>
                    <span className="badge badge-pill badge-outline-primary m-2"
                      v-if="_folder.notifications.length > 0">
                      {'{{_folder.notifications.length}}'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            {/* Mail List */}
            <div className="mail-list-container col-md-2 pt-4 pb-4 border-right bg-white h-100"
              v-if="vueBind.model.notifications && vueBind.model.notifications.length > 0">
              <div className="d-flex border-bottom pb-2 mb-3 px-3">
                <div className="form-check">
                  <label className="form-check-label">
                    <input
                      {...{ 'v-on:change': 'selectAllNotifications($event)' }}
                      type="checkbox"
                      className="form-check-input" />
                    <i className="input-helper"></i>
                  </label>
                </div>

                <div className="d-flex">
                  <button
                    {...{ ':disabled': '!vueBind.model.hasNotificationSelected' }}
                    title="Mark as read" type="button" className="btn btn-outline-secondary btn-rounded btn-icon mx-2">
                    <i className="mdi mdi-email-open"></i>
                  </button>
                  <button
                    {...{ ':disabled': '!vueBind.model.hasNotificationSelected' }}
                    title="Delete" type="button"
                    className="btn btn-outline-secondary btn-rounded btn-icon mx-2">
                    <i className="mdi mdi-delete"></i>
                  </button>
                </div>
              </div>
              <div className="mail-list cursor-pointer"
                v-for="_notification in vueBind.model.notificationFolderSelected.notifications"
                {...{ 'v-on:click': 'selectNotificationOnClick($event, _notification)' }}
                {...{ 'v-bind:class': "{'new_mail': _notification.id === vueBind.model.notificationSelected.id }" }}>
                <div className="form-check">
                  <label className="form-check-label">
                    <input
                      {...{ 'v-on:change': 'addNotificationOnChange($event, _notification)' }}
                      v-model="_notification.selected"
                      type="checkbox"
                      className="form-check-input" />
                    <i className="input-helper"></i>
                  </label>
                </div>
                <div className="content">
                  <p className="sender-name">{'{{_notification.subject}}'}</p>
                  <p className="message_text">{'{{_notification.message_resume}}'}</p>
                </div>
              </div>
            </div>
            {/* Mail view */}
            <div className="mail-view col-md-9 col-lg-8 d-none d-md-block bg-white h-100"
              v-if="vueBind.model.notifications && vueBind.model.notifications.length > 0">
              <div className="row">
                <div className="col-md-12 mb-4 mt-4">
                  <div className="btn-toolbar">
                    <div className="btn-group">
                      <a
                        {...{ 'v-bind:href': '"/notification/compose?action=re&id=" + vueBind.model.notificationSelected.id' }}
                        className="btn btn-sm btn-outline-secondary">
                        <i className="mdi mdi-reply text-primary"></i> {this.props.data.locale.MAIL_REPLY_BUTTON}
                      </a>
                      <a
                        {...{ 'v-bind:href': '"/notification/compose?action=fw&id=" + vueBind.model.notificationSelected.id' }}
                        className="btn btn-sm btn-outline-secondary">
                        <i className="mdi mdi-share text-primary"></i>{this.props.data.locale.MAIL_FORWARD_BUTTON}
                      </a>
                    </div>
                    <div className="btn-group">
                      <button type="button" className="btn btn-sm btn-outline-secondary">
                        <i className="mdi mdi-delete text-primary"></i>{this.props.data.locale.MAIL_DELETE_BUTTON}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="message-body">
                <div className="sender-details">
                  <img className="img-sm rounded-circle mr-3" src="https://via.placeholder.com/43x43" alt="" />
                  <div className="details">
                    <p className="msg-subject">{'{{vueBind.model.notificationSelected.subject}}'}</p>
                    <p className="sender-email">
                      {'{{phoneNumber(vueBind.model.notificationSender.phone)}}'},
                      {'{{vueBind.model.notificationSender.firstname}}'} {'{{vueBind.model.notificationSender.lastname}}'}
                      - <a href="#">{'{{vueBind.model.notificationSender.email}}'}</a>
                    </p>
                  </div>
                </div>
                <div className="message-content">
                  <div v-html="vueBind.model.notificationSelected.message"></div>
                </div>
              </div>
            </div>
            {/* Empty mails */}
            <section v-if="!vueBind.model.notifications || vueBind.model.notifications.length <= 0"
              className="d-flex col-10 bg-white text-center empty-list align-items-center justify-content-center">
              <div>
                <h4 className="text text-center d-flex justify-content-center">{this.props.data.locale.EMPTYDATA_MESSAGE_LABEL}</h4>
                <img height="100" src="/img/test/starter/empty-list.svg" alt="empty list" className="img d-block mx-auto my-4" />
                <a className="btn btn-primary" href="/notification/compose">{this.props.data.locale.EMPTYDATA_ACTION_BUTTON}</a>
              </div>
            </section>
          </div>
        </div>

      </Layout>
    );
  }
}

module.exports = Index;

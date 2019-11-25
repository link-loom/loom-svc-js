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
                <div className="container pt-2">
                  <h4 className="card-title">{this.props.data.locale.MAIN_TITLE_LABEL}</h4>
                  <p className="card-description">{this.props.data.locale.MAIN_DESCRIPTION_LABEL}</p>

                  {/* Profile */}
                  <section className="profile-container my-5 border">
                    <h3 className="p-4">{this.props.data.locale.PROFILE_TITLE_LABEL}</h3>

                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th className="p-0"></th>
                          <th className="p-0"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{this.props.data.locale.PROFILE_EMAIL_LABEL}</td>
                          <td>{'{{vueBind.model.user.email}}'}</td>
                        </tr>
                        <tr>
                          <td>{this.props.data.locale.PROFILE_DNI_LABEL}</td>
                          <td>{'{{vueBind.model.user.dni}}'}</td>
                        </tr>
                        <tr>
                          <td>{this.props.data.locale.PROFILE_NAME_LABEL}</td>
                          <td>{'{{vueBind.model.user.firstname}}'} {'{{vueBind.model.user.lastname}}'}</td>
                        </tr>
                      </tbody>
                    </table>

                    <a href="/account/profile/" className="btn btn-outline-primary btn-fw m-3">{this.props.data.locale.PROFILE_EDIT_BUTTON}</a>
                  </section>

                  {/* Plan */}
                  <section className="plan-container my-5 border-dark-green">
                    <h3 className="bg-dark-green text-white pl-4 py-2 m-0">{this.props.data.locale.PLAN_TITLE_LABEL}</h3>

                    <section className="d-flex flex-column">
                      <header className="py-5 px-4 bg-green">
                        <h2 className="display-2 text-white">{'{{vueBind.model.plan.name}}'}</h2>
                      </header>

                      <div className="d-flex border-left border-right border-bottom p-4">
                        <article className="col-4 border py-3">
                          <h4>{this.props.data.locale.GOPREMIUM_TITLE_LABEL}</h4>
                          <p>{this.props.data.locale.GOPREMIUM_DESCRIPTION_LABEL}</p>
                          <button className="btn btn-warning">{this.props.data.locale.GOPREMIUM_BUTTON}</button>
                        </article>
                        <article className="col-4 py-3">
                          <h4>{this.props.data.locale.PLAN_DESCRIPTION_LABEL}</h4>
                          <p>{'{{vueBind.model.plan.description}}'}</p>
                          <button className="btn btn-light">{this.props.data.locale.PLAN_DESCRIPTION_LEARNMORE_BUTTON}</button>
                        </article>
                        <article className="col-4 py-3">
                          <h4>{this.props.data.locale.PLAN_PAYMENT_LABEL}</h4>
                          <p>{this.props.data.locale.PLAN_PAYMENT_DATE_COMPOSED}</p>
                          <button className="btn btn-light">{this.props.data.locale.PLAN_PAYMENT_MANAGE_BUTTON}</button>
                        </article>
                      </div>
                    </section>
                  </section>

                  {/* Signout */}
                  <section className="signout-container my-5 p-4 border">
                    <h3>{this.props.data.locale.SIGNOUT_TITLE_LABEL}</h3>

                    <p>{this.props.data.locale.SIGNOUT_DESCRIPTION_LABEL}</p>

                    <blockquote className="blockquote">{this.props.data.locale.SIGNOUT_DESCRIPTION_BLOCKQUOTE}</blockquote>

                    <button
                      {...{ 'v-on:click': 'logoutOnClick($event)' }}
                      className="btn btn-outline-primary btn-fw">{this.props.data.locale.SIGNOUT_ACTION_BUTTON}</button>
                  </section>

                  {/* Language */}
                  <section className="language-container my-5 p-4 border">
                    <h3>{this.props.data.locale.LANGUAGE_TITLE_LABEL}</h3>

                    <p>{this.props.data.locale.LANGUAGE_DESCRIPTION_LABEL}</p>

                    <blockquote className="blockquote">{this.props.data.locale.LANGUAGE_DESCRIPTION_BLOCKQUOTE}</blockquote>

                    <div className="form-group">
                      <select id="language-select" className="form-control"
                        v-model="vueBind.model.lang">
                        <option
                          {...{ 'v-bind:value': '_lang' }}
                          v-for="_lang in vueBind.model.langs">{'{{_lang.name}}'}</option>
                      </select>
                    </div>

                    <button
                      {...{ 'v-on:click': 'setCurrentLang($event)' }}
                      className="btn btn-outline-primary btn-fw">{this.props.data.locale.LANGUAGE_ACTION_BUTTON}</button>
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

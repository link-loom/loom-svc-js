const React = require('react');
const PropTypes = require('prop-types');
const Layout = require('./../shared/_layoutGeneral');

class Index extends React.Component {
  render () {
    return (
      <Layout {...this.props}>

        <div className="row">
          <div className="col-12 col-md-11 col-lg-9 grid-margin mx-auto d-block p-0">
            <div className="card">
              <div className="p-md-4 pt-3">
                <div className="container pt-2">
                  <h2 className="text-center text-primary">{this.props.data.locale.MAIN_TITLE_LABEL}</h2>
                  <h4 className="card-description text-center pb-md-5">{this.props.data.locale.MAIN_DESCRIPTION_LABEL}</h4>

                  <div className="row">
                    <div className="col-12 col-md-4 text-center py-3">
                      <img className="mx-auto" src="/private/img/make-a-sale-v1.svg" alt="make a sale" />
                      <h4 className="h3 font-weight-bold my-2">{this.props.data.locale.SALE_TITLE_LABEL}</h4>
                      <p className="card-text mb-2">{this.props.data.locale.SALE_DESCRIPTION_LABEL}</p>
                      <a href="/sell/cashier" className="btn btn-primary">{this.props.data.locale.SALE_ACTION_BUTTON}</a>
                    </div>

                    <div className="col-12 col-md-4 text-center py-3">
                      <img className="mx-auto" src="/private/img/add-a-product-v1.svg" alt="make a sale" />
                      <h4 className="h3 font-weight-bold my-2">{this.props.data.locale.PRODUCT_TITLE}</h4>
                      <p className="card-text mb-2">{this.props.data.locale.PRODUCT_DESCRIPTION}</p>
                      <a href="/product/list" className="btn btn-primary">{this.props.data.locale.PRODUCT_ACTION_BUTTON}</a>
                    </div>

                    <div className="col-12 col-md-4 text-center py-3">
                      <img className="mx-auto" src="/private/img/add-a-customer-v1.svg" alt="make a sale" />
                      <h4 className="h3 font-weight-bold my-2">{this.props.data.locale.CUSTOMER_TITLE}</h4>
                      <p className="card-text mb-2">{this.props.data.locale.CUSTOMER_DESCRIPTION}</p>
                      <a href="user/list/" className="btn btn-primary">{this.props.data.locale.CUSTOMER_ACTION_BUTTON}</a>
                    </div>
                  </div>


                  <div className="row">
                    <p className="my-5 text-center w-100">{this.props.data.locale.FOOTER_HELP_LABEL} <a href="#">{this.props.data.locale.FOOTER_GUIDE_LINK}</a>.</p>
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

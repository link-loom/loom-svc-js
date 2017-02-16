function StripeController(dependencies) {

    /// Dependencies   
    var _stripe;
    var _cross;

    /// Configuration
    var stripe_pk = '';

    var constructor = function () {
        _cross = dependencies.cross;

        stripe_pk = _cross.GetStripePrivateKey();

        stripe = new dependencies.stripe(stripe_pk);
    }

    var getStandardPlan = function () {
        stripe.plans.retrieve(
            "standard",
            function (err, plan) {
                return plan;
            })
    }

    var getBasicPlan = function () {
        stripe.plans.retrieve(
            "basic",
            function (err, plan) {
                return plan;
            })
    }

    var getPremiumPlan = function () {
        stripe.plans.retrieve(
            "premium",
            function (err, plan) {
                return plan;
            })
    }

    var getFreePlan = function () {
        stripe.plans.retrieve(
            "free",
            function (err, plan) {
                return plan;
            })
    }

    var createSubscription = function (planId, customerData) {
        // Find in mongo if exist email
        // if not exist create a customer 
        //// Suscribe the customer to the plan
        //// Save customer on mongo
        // if exist retrieve the customer
        //// Update subscription
        //// Update customer on mongo
    }

    return {
        Initialize: constructor,
        GetFreePlan: getFreePlan,
        GetBasicPlan: getBasicPlan,
        GetStandardPlan: getStandardPlan,
        GetPremiumPlan: getPremiumPlan
    }
}

module.exports = StripeController;
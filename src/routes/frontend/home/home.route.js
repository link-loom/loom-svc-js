function home (dependencies) {
  // const _database = dependencies.database
  const _utilities = dependencies.utilities

  const index = function (req, res) {
    var someCondition = true
    if (someCondition === true) {
      res.render('index/index.view.jsx', { title: 'Home', data: null })
    } else {
      let categoriesResult = { result: {} }
      _utilities.request.badRequestView(req, res, categoriesResult.result)
    }
  }

  return {
    index: index
  }
}

module.exports = home

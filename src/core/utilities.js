function utilities (dependencies) {
  /// Find an object dynamically by dot style
  /// E.g.
  /// var objExample = {employee: { firstname: "camilo", job:{name:"developer"}}}
  /// searchDotStyle(objExample, 'employee.job.name')
  const searchDotStyle = (obj, query) => {
    return query.split('.').reduce((key, val) => key[val], obj)
  }

  const idGenerator = (length, prefix) => {
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return (prefix === undefined ? 'seed-' : prefix) + Math.random().toString(36).substr(2, (length === undefined ? 5 : length))
  }

  const propertyIsValid = function (property) {
    if (property) {
      if (property.success === true) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  const throwError = function (message) {
    if (message) {
      return { success: false, message: message, result: null }
    } else {
      return { success: false, message: 'Something was wrong while you make this action', result: null }
    }
  }

  const throwSuccess = function (data, message) {
    if (message) {
      return {
        success: true,
        message: message,
        result: data
      }
    } else {
      return {
        success: true,
        message: 'Operation completed succesfuly',
        result: data
      }
    }
  }

  const badRequestView = function (req, res) {
    res.render('maintenanceView', null)
    res.render('maintenance/maintenance.view.jsx', null)
  }

  return {
    searchers: {
      object: {
        searchDotStyle: searchDotStyle
      },
      array: {}
    },
    idGenerator: idGenerator,
    response: {
      success: throwSuccess,
      error: throwError,
      badRequestView: badRequestView,
      isValid: propertyIsValid
    }
  }
}

module.exports = utilities

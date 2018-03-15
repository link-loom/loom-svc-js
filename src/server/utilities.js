function utilities(){

  /// Find an object dynamically by dot style
  /// E.g.
  /// var objExample = {employee: { firstname: "camilo", job:{name:"driver"}}}
  /// findObject(objExample, 'employee.job.name')
  const objectReferenceByDotStyle = (obj, is, value) => {
    if (typeof is == 'string')
      return index(obj, is.split('.'), value);
    else if (is.length == 1 && value !== undefined)
      return obj[is[0]] = value;
    else if (is.length == 0)
      return obj;
    else
      return index(obj[is[0]], is.slice(1), value);
  }

  const idGenerator = (length, prefix) => {
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return (prefix == undefined ? 'seed-' : prefix) + Math.random().toString(36).substr(2, (length == undefined ? 5 : length));
  }

  const propertyIsValid = function (property) {
    if (property) {
      if (property.success === true) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }
  return {
    objectReferenceByDotStyle: objectReferenceByDotStyle,
    idGenerator:idGenerator,
    propertyIsValid: propertyIsValid,
  }
}

module.exports = utilities;

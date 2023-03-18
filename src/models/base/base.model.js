/**
 * @swagger
 * components:
 *   schemas:
 *     Response:
 *       type: object
 *       required:
 *         - status
 *         - success
 *         - message
 *         - result
 *       properties:
 *         status:
 *           type: number
 *           description: Is the HTTP status code
 *         success:
 *           type: boolean
 *           description: Define if response was failed or success
 *         message:
 *           type: string
 *           description: The server error message
 *         result:
 *           type: object
 *           description: Is the result object as DTO
 *       example:
 *         status: 500
 *         success: false
 *         message: Something was wrong while you make this action
 *         result: {}
 */
class ModelBase {
  constructor (dependencies) {
    if (!dependencies) {
      throw new Error('Required dependencies to build this entity')
    }
    this._dependencies = dependencies
  }

  get getPropertiesAsCommas () {
    return (Object.keys(this.get)).join()
  }

  get getPropertiesAsBindings () {
    const keys = Object.keys(this.get)

    return (keys.map((key, index) => `$${index + 1}`)).join()
  }

  get getValuesAsArray () {
    return (Object.values(this.get.value)).join()
  }

  get getPropertiesAsAssignment () {
    let keys = Object.keys(this.get)
    keys = keys.filter(key => this.get[key].value)
    return (keys.map(key => `${key}=${this.get[key].value}`)).join()
  }

  getPropertyAsReference ({ namespace, property }) {
    return `REFERENCES "${namespace}"."${this.get[property].reference.table}" ("${this.get[property].reference.property}")`
  }
}

module.exports = ModelBase

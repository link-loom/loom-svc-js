class UploadService {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies
    this._db = dependencies.db
    this._models = dependencies.models
    this._utilities = dependencies.utilities
    this._console = this._dependencies.console
    this._firebase = dependencies.firebaseManager
    this._services = this._dependencies.services

    /* Custom Properties */
    this.excel = dependencies.exceljs

    /* Assigments */
    /* this._newPrivateObject = new SomeObject(this._dependencies) */
  }

  async uploadFile (req) {
    try {
      if (!req || !req.file) {
        return this._utilities.io.response.error('Add a file')
      }

      if (!req.body || !req.body.route || !req.body.handler) {
        return this._utilities.io.response.error('Add a path to handle your bulk request, please')
      }

      if (!this._services[req.body.route] || !this._services[req.body.route][req.body.handler]) {
        return this._utilities.io.response.error('Given path to handle your bulk request is not available')
      }

      const file = req.file
      file.originalname = `${file.originalname.slice(0, file.originalname.lastIndexOf('.'))}_${Date.now()}${file.originalname.slice(file.originalname.lastIndexOf('.'), file.originalname.length)}`

      // TODO: Do something with uploaded file

      return this._utilities.io.response.success()
    } catch (error) {
      return this._utilities.io.response.error()
    }
  }

  /**
   * Transform a xlsx file into a list
   * @param {File} file
   * @returns Transformed file into a list of { rows: [] }
   */
  async digestFileToArray (file) {
    const processedFile = { rows: [] }

    if (!file) {
      return processedFile
    }

    const transformFileData = async (resolve) => {
      const workbook = new this._excel.Workbook()

      await workbook.xlsx.load(file.buffer)

      workbook.eachSheet((worksheet) => {
        if (worksheet._rows <= 0) {
          resolve(processedFile)
          return
        }

        const labels = worksheet._rows[0].values

        worksheet.eachRow({}, (row, rowNumber) => {
          if (rowNumber > 1) {
            // Transform rows to objects
            const transformedRow = Object
              .assign({}, ...row.values
                .map((item, index) => ({
                  [labels[index].toLocaleLowerCase()]: (item && item.result ? item.result : item && item.text ? item.text : item)
                })
                )
              )

            processedFile.rows.push(transformedRow)
            resolve(processedFile)
          }
        })
      })
    }

    return new Promise(transformFileData)
  }

  async uploadAllBulkRows (req, fileTransformed) {
    try {
      const response = {
        success: 0,
        failed: 0,
        rows: []
      }

      // Execute all rows and try to save it
      for (const row of fileTransformed.rows) {
        const entityResponse = await this._services[req.body.route][req.body.handler](row)

        if (entityResponse && entityResponse.success) {
          response.success += 1
        } else {
          response.failed += 1
        }

        response.rows.push(entityResponse)
      }

      return this._utilities.io.response.success(response)
    } catch (error) {
      return this._utilities.io.response.error()
    }
  }

  validateBulk (req) {
    if (!req || !req.file) {
      return this._utilities.io.response.error('Add a file')
    }

    if (!req.body || !req.body.route || !req.body.handler) {
      return this._utilities.io.response.error('Add a path to handle your bulk request, please')
    }

    if (!this._services[req.body.route] || !this._services[req.body.route][req.body.handler]) {
      return this._utilities.io.response.error('Given path to handle your bulk request is not available')
    }

    return this._utilities.io.response.success(req)
  }

  async bulk (req) {
    try {
      const canBulk = this.validateBulk(req)
      const file = req.file
      const fileTransformed = await this.digestFileToArray(file)

      if (!canBulk.success) {
        return canBulk
      }

      if (!fileTransformed || !fileTransformed.rows || !fileTransformed.rows.length) {
        return this._utilities.io.response.error('File not processed because is empty')
      }

      return this.uploadAllBulkRows(req, fileTransformed)
    } catch (error) {
      return this._utilities.io.response.error(error.message)
    }
  }
}

module.exports = UploadService

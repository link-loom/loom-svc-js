class UploadController {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies
    this._db = dependencies.db
    this._models = dependencies.models
    this._utilities = dependencies.utilities
    this._console = this._dependencies.console
    this._firebase = dependencies.firebaseManager
    this._controllers = this._dependencies.controllers

    /* Custom Properties */
    this._spacesManager = dependencies.spacesManager
    this.excel = dependencies.exceljs

    /* Assigments */
    /* this._newPrivateObject = new SomeObject(this._dependencies) */
  }

  async existsBucket (buckets, bucketName) {
    let existBucket = false
    for (const bucket of buckets) {
      if (bucket.Name === bucketName) {
        existBucket = true
        break
      }
    }

    return existBucket
  }

  async uploadFile (req) {
    try {
      if (!req || !req.file) {
        return this._utilities.response.error('Add a file')
      }

      if (!req.body || !req.body.route || !req.body.handler) {
        return this._utilities.response.error('Add a path to handle your bulk request, please')
      }

      if (!this._controllers[req.body.route] || !this._controllers[req.body.route][req.body.handler]) {
        return this._utilities.response.error('Given path to handle your bulk request is not available')
      }

      const file = req.file
      file.originalname = `${file.originalname.slice(0, file.originalname.lastIndexOf('.'))}_${Date.now()}${file.originalname.slice(file.originalname.lastIndexOf('.'), file.originalname.length)}`
      const bucketName = this._spacesManager.getCredentials().bucket
      const uploadParams = {
        Bucket: bucketName,
        Key: file.originalname,
        Body: file.buffer,
        ACL: 'public-read'
      }
      const bucketsResponse = await this.listBuckets()

      if (!this.existsBucket(bucketsResponse.Buckets, bucketName)) {
        const bucketParams = {
          Bucket: bucketName,
          ACL: 'public-read'
        }

        await this.createBucket(bucketParams)
      }

      const uploadResponse = await this.uploadObject(uploadParams)

      if (!uploadResponse) {
        return this._utilities.response.error('Something was wrong uploading the file')
      }

      const payload = this.dependencies.isJsonString(req.body.payload || '') ? JSON.parse(req.body.payload) : {}
      const controller = this._controllers[req.body.route][req.body.handler]

      return controller({
        ...payload,
        ...{
          filename: uploadResponse.key,
          uri: uploadResponse.Location
        }
      })
    } catch (error) {
      return this._utilities.response.error(error.message ? error.message : error)
    }
  }

  async bulkFileHandler (file) {
    const transformFileData = async (resolve) => {
      const workbook = new this._excel.Workbook()
      const processedFile = { rows: [] }

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

  async bulk (req) {
    try {
      if (!req || !req.file) {
        return this._utilities.response.error('Add a file')
      }

      if (!req.body || !req.body.route || !req.body.handler) {
        return this._utilities.response.error('Add a path to handle your bulk request, please')
      }

      if (!this._controllers[req.body.route] || !this._controllers[req.body.route][req.body.handler]) {
        return this._utilities.response.error('Given path to handle your bulk request is not available')
      }

      const file = req.file
      const fileTransformed = await this.bulkFileHandler(file)

      if (!fileTransformed || !fileTransformed.rows || !fileTransformed.rows.length) {
        return this._utilities.response.error('File not processed because is empty')
      }

      const response = {
        success: 0,
        failed: 0
      }

      await Promise.all(fileTransformed.rows.map((row) => {
        const bulkHandler = async (resolve) => {
          const entityResponse = await this._controllers[req.body.route][req.body.handler](row)

          if (entityResponse && entityResponse.success) {
            response.success += 1
          } else {
            response.failed += 1
          }

          resolve()
        }

        return new Promise(bulkHandler)
      }))

      return this._utilities.response.success(response)
    } catch (error) {
      return this._utilities.response.error(error.message)
    }
  }

  get status () {
    return this._models.Upload.statuses
  }
}

module.exports = UploadController

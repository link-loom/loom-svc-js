function uploadController (dependencies) {
  const _cdnStorage = dependencies.cdnStorage
  const _console = dependencies.console
  const _utilities = dependencies.utilities
  const _excel = dependencies.exceljs

  const uploadFile = (req, res) => {
    return new Promise((resolve, reject) => {
      if (!req || !req.file) {
        reject(new Error('Add an image file, please'))
      }

      const file = req.file
      file.originalname = `${Date.now()}_${file.originalname}`

      _cdnStorage(req, res, (error) => {
        if (error) {
          _console.log(error)
          reject(_utilities.response.error(error))
          return
        }

        resolve(_utilities.response.success(`${file.originalname}`))
      })
    })
  }

  const bulk = (req, res) => {
    return new Promise(async (resolve, reject) => {
      const file = req.file

      if (!req || !req.file) {
        reject(new Error('Add an image file, please'))
        return
      }

      let workbook = new _excel.Workbook()
      let processedFile = {}

      await workbook.xlsx.load(file.buffer)

      workbook.eachSheet((worksheet, sheetId) => {
        processedFile[worksheet.name] = { rows: [] }

        worksheet.eachRow({}, (row, rowNumber) => {
          processedFile[worksheet.name].rows.push({
            values: row.values
          })
          resolve(_utilities.response.success(processedFile))
        })
      })
    })
  }

  return {
    uploadFile,
    bulk
  }
}

module.exports = uploadController

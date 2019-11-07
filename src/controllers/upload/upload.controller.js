function userController (dependencies) {
  const _storage = dependencies.storage
  const _console = dependencies.console
  const _utilities = dependencies.utilities
  const _excel = dependencies.exceljs

  let bucket = {}

  const uploadImage = (file) => {
    bucket = _storage.bucket()
    let prom = new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('Add an image file, please'))
      }
      let newFileName = `${Date.now()}_${file.originalname}`

      let bucketFile = bucket.file(newFileName)

      const blobStream = bucketFile.createWriteStream({
        metadata: {
          contentType: file.mimetype
        }
      })

      blobStream.on('error', (error) => {
        _console.error(error)
        reject(new Error('Something was wrong, try again'))
      })

      blobStream.on('finish', () => {
        // The public URL can be used to directly access the file via HTTP.
        const url = `https://storage.googleapis.com/${bucket.name}/${bucketFile.name}`

        bucketFile.makePublic().then(() => {
          resolve(_utilities.response.success({
            status: 'success',
            url
          }))
        })
      })

      blobStream.end(file.buffer)
    })
    return prom
  }

  const bulk = (file) => {
    let prom = new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('Add an image file, please'))
      }

      var workbook = new _excel.Workbook()

      workbook.xlsx.load(file.buffer)
        .then(function () {
          // use workbook

          workbook.eachSheet(function (worksheet, sheetId) {
            console.log('Current worksheet: ', worksheet.name)
            console.log('Rows: ', worksheet.rowCount)

            worksheet.eachRow({}, function (row, rowNumber) {
              console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values))

              row.eachCell(function (cell, colNumber) {
                console.log('Cell ' + colNumber + ' = ' + cell.value)
              })
            })
          })
          // var worksheet = workbook.getWorksheet('Hoja1')

          resolve(_utilities.response.success({
            status: 'success'
          }))
        })
    })
    return prom
  }

  return {
    uploadImage,
    bulk
  }
}

module.exports = userController

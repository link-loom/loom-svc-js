function uploadController (dependencies) {
  const _s3 = dependencies.s3
  const _cdnStorage = dependencies.cdnStorage
  const _console = dependencies.console
  const _spacesManager = dependencies.spacesManager
  const _utilities = dependencies.utilities
  const _excel = dependencies.exceljs

  const listBuckets = async () => {
    return _s3.listBuckets().promise()
  }

  const createBucket = async (bucketParams) => {
    return _s3.createBucket(bucketParams).promise()
  }

  const uploadObject = async (uploadParams) => {
    return _s3.upload(uploadParams).promise()
  }

  const existsBucket = (buckets, bucketName) => {
    let existBucket = false
    for (let i = 0; i < buckets.length; i++) {
      const bucket = buckets[i]
      if (bucket.Name === bucketName) {
        existBucket = true
        break
      }
    }

    return existBucket
  }

  const uploadFile = async (req, res) => {
    try {
      if (!req || !req.file) {
        return _utilities.response.error('Add an image file, please')
      }

      const bucketName = _spacesManager.getCredentials().bucket
      const file = req.file
      file.originalname = `${Date.now()}_${file.originalname}`
      const uploadParams = {
        Bucket: bucketName,
        Key: file.originalname,
        Body: file.buffer,
        ACL: 'public-read'
      }
      const bucketsResponse = await listBuckets()

      if (!existsBucket(bucketsResponse.Buckets, bucketName)) {
        const bucketParams = {
          Bucket: bucketName,
          ACL: 'public-read'
        }

        await createBucket(bucketParams)
      }

      const uploadResponse = await uploadObject(uploadParams)

      if (!uploadResponse) {
        _utilities.response.error(new Error('Something was wrong uploading the file'))
      }

      return _utilities.response.success(uploadResponse)
    } catch (error) {
      return _utilities.response.error(error)
    }
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

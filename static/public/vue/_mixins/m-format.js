// eslint-disable-next-line no-unused-vars
var format = {
  methods: {
    formatPrice (value) {
      if (!value) {
        return 0
      }
      // Cast to string
      value = value + ''
      // Remove the $ symbol and commas
      const rawNum = value.replace(/[$,]/g, '')
      // Separate nums and decimals
      const nums = rawNum.split('.')
      // Get nums separated by hundreds
      const num = nums.length > 1 ? nums[0].split(/(?=(?:...)*$)/).join(',') : rawNum.split(/(?=(?:...)*$)/).join(',')
      if (rawNum.length > 0) {
        // if has decimals
        if (nums.length > 1) {
          const decimals = nums[1]
          // Format num and decimals
          return `${num}.${decimals}`
        }
      }
      return num
    },
    phoneNumber (value) {
      if (!value) {
        return ''
      }

      // Cast to string
      value = value + ''

      // Filter only numbers from the input
      value = ('' + value).replace(/\D/g, '')

      let regex = ''

      if (value.length === 12) {
        regex = /(\d{2})(\d{3})(\d{3})(\d{4})$/
      } else if (value.length === 11) {
        regex = /(\d{1})(\d{3})(\d{3})(\d{4})$/
      }

      if (regex) {
        // Check if the input is of correct
        const match = value.match(regex)

        if (match) {
          // Remove the matched extension code
          // Change this to format for any country code.
          const intlCode = `+${match[1]}`
          return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
        }
      }

      return value
    }
  }
}

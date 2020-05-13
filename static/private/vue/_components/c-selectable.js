/* global Vue */
Vue.component('selectable', {
  template: `<section class="typeahead-container d-flex flex-column flex-grow-1">
              <input class="search-input form-control flex-fill" name="q" type="search" autoComplete="off"
                v-model="typeahead"
                v-bind:id="uid" 
                v-bind:class="uid"
                :placeholder="placeholder" />
                <section
                  v-if="typeahead"
                  class="typeahead-results-container position-relative">
                  <ul class="typeahead-results category-list list-group-flush p-0 border">
                    <li
                      v-for="_result in typeaheadResults"
                      v-on:click="resultItemOnClick($event, _result)"
                      class="category-item list-group-item border-0 pl-4">{{_result[label]}}</li>
                  </ul>
                </section>
            </section>`,
  data () {
    return {
      typeaheadResults: [],
      typeahead: ''
    }
  },
  props: [
    'uid',
    'list',
    'filters',
    'label',
    'placeholder',
    'hasglobalkeyboard',
    'avoidselectablelist'
  ],
  mounted () {
    this.initializeComponent()
  },
  watch: {
    typeahead: function (newData, oldData) {
      this.typeaheadOnChange()
    }
  },
  methods: {
    initializeComponent () {
      if (this.hasglobalkeyboard) {
        setTimeout(_ => {
          this.setupKeyboardEvents()
        }, 100)
      }
    },
    keystrokeWithModified (e) {
      return e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.key.toLocaleLowerCase() === 'dead'
    },
    setupKeyboardEvents () {
      const keyUp = (evt) => {
        evt = evt || window.event

        // Catch all characters, numbers and symbols
        if (evt.keyCode >= 48 && evt.keyCode !== 229) {
          // Prevent repeated character
          if (evt.isMobile) {
            this.typeahead = document.querySelector('#' + this.uid).value
            this.typeaheadOnChange()
            return
          }

          if (!this.avoidselectablelist || this.avoidselectablelist.length <= 0) {
            if (!document.activeElement.classList.contains(this.uid) &&
              !this.keystrokeWithModified(evt)) {
              this.typeahead += evt.key
            }
            return
          }

          let canType = true
          for (const selectable of this.avoidselectablelist) {
            if ((document.activeElement.classList.contains(this.uid) ||
              document.activeElement.classList.contains(selectable)) ||
              this.keystrokeWithModified(evt)) {
              canType = false
              break
            }
          }
          if (canType) {
            this.typeahead += evt.key
          }
        }

        let canIterate = true
        for (const selectable of this.avoidselectablelist) {
          if (!document.activeElement.classList.value.includes(selectable)) {
            switch (evt.keyCode) {
              case 13: // Catch Enter
                this.searchTypeaheadValue(this.typeahead.trim() || document.querySelector('#' + this.uid).value, true)
                canIterate = false
                break
              case 32: // Catch Space
                if (!evt.isMobile) {
                  this.typeahead += ' '
                  canIterate = false
                  break
                }
            }
          }

          if (!canIterate) {
            break
          }
        }

        this.keyboardKeyUp(evt)
      }

      document.querySelector('#' + this.uid).addEventListener('input', (evt) => {
        if ((navigator.browser.android || navigator.browser.iphone || navigator.browser.ipad) &&
          (document.activeElement.id && document.activeElement.id === this.uid) &&
          (!evt.keyCode || !evt.key)) {
          evt.keyCode = evt.keyCode || document.querySelector('#' + this.uid).value.substr(-1).charCodeAt(0)
          evt.key = evt.key || document.querySelector('#' + this.uid).value.substr(-1)
          evt.isMobile = true

          keyUp(evt)
        }
      })

      document.onkeypress = (evt) => {
        // Catch Space and prevent scroll down
        for (const selectable of this.avoidselectablelist) {
          if (!document.activeElement.classList.contains(selectable) && evt.keyCode === 32) {
            return false
          }
        }
      }
      document.onkeyup = keyUp
    },
    keyboardKeyUp (evt) {
      this.$emit('keyboard-keyup', evt)
    },
    findObjectByMultipleKeySearching (search, keys, _arr) {
      if (!_arr || !search || !keys) {
        return null
      }
      return _arr.find(function (item) {
        return keys.some(key =>
          String(item[key]).toLowerCase().includes(search.toLowerCase())
        )
      })
    },
    filterObjectByMultipleKeySearching (search, keys, _arr) {
      if (!_arr || !search || !keys) {
        return null
      }
      return _arr.filter(function (item) {
        return keys.some(key =>
          String(item[key]).toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      })
    },
    typeaheadOnChange () {
      this.searchTypeaheadValue(false)
    },
    searchTypeaheadValue (enter) {
      this.typeaheadResults = []

      if (!this.filters || this.filters.length <= 0) {
        return
      }

      // Find by code
      if (enter) {
        const product = this.findObjectByMultipleKeySearching(this.typeahead, this.filters, this.list)

        if (product) {
          document.querySelector('.' + this.uid).value = ''
          this.typeahead = ''
          // this.stockProductOnClick(null, product)
          this.$emit('item-selected', product)
        }
      } else {
        const itemsFound = this.filterObjectByMultipleKeySearching(this.typeahead, this.filters, this.list)
        if (itemsFound) {
          this.typeaheadResults = this.typeaheadResults.concat(itemsFound)
        }
      }
    },
    resultItemOnClick (event, item) {
      if (event) { event.preventDefault() }

      if (!item) {
        this.showError({
          message: 'Selectable component has wrong configuration'
        })
      }

      // this.stockProductOnClick(null, product)
      this.$emit('item-selected', item)
      this.cleanSelectable()
    },
    cleanSelectable () {
      this.typeaheadResults = []
      document.querySelector('.' + this.uid).value = ''
      this.typeahead = ''
    }
  }
})

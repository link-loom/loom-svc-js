/* global Vue */
Vue.component('selectable', {
  template: `<section class="typeahead-container d-flex flex-column">
              <input
                v-model="typeahead"
                v-bind:id="uid" v-bind:class="uid" class="search-input form-control flex-fill" name="q"
                type="search" autoComplete="off" :placeholder="placeholder" />
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
      this.typeaheadOnChange(newData)
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
      document.onkeydown = (evt) => {
        // Catch Delete
        if (evt.keyCode === 8) {
          const newValue = this.typeahead.slice(0, -1)
          this.typeahead = newValue
        }
      }
      document.onkeypress = (evt) => {
        // Catch Space and prevent scroll down
        for (const selectable of this.avoidselectablelist) {
          if (!document.activeElement.classList.contains(selectable)) {
            if (evt.keyCode === 32) {
              return false
            }
          }
        }
      }
      document.onkeyup = (evt) => {
        evt = evt || window.event

        // Catch all characters, numbers and symbols
        if (evt.keyCode >= 48) {
          // Prevent repeated character
          if (this.avoidselectablelist && this.avoidselectablelist.length > 0) {
            for (const selectable of this.avoidselectablelist) {
              if ((!document.activeElement.classList.contains(this.uid) &&
                !document.activeElement.classList.contains(selectable)) &&
                !this.keystrokeWithModified(evt)) {
                this.typeahead += evt.key
              }
            }
          } else {
            if ((!document.activeElement.classList.contains(this.uid)) &&
              !this.keystrokeWithModified(evt)) {
              this.typeahead += evt.key
            }
          }
        }

        for (const selectable of this.avoidselectablelist) {
          if (!document.activeElement.classList.contains(selectable)) {
            switch (evt.keyCode) {
              case 13: // Catch Enter
                this.searchTypeaheadValue(this.typeahead, true)
                break
              case 32: // Catch Space
                this.typeahead += ' '
                break
            }

            this.keyboardKeyUp(evt)
          }
        }
      }
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
    typeaheadOnChange (event) {
      this.searchTypeaheadValue(event, false)
    },
    searchTypeaheadValue (val, enter) {
      this.typeaheadResults = []

      if (!this.filters || this.filters.length <= 0) {
        return
      }

      // Find by code
      if (enter) {
        const product = this.findObjectByMultipleKeySearching(val, this.filters, this.list)

        if (product) {
          document.querySelector('.' + this.uid).value = ''
          this.typeahead = ''
          // this.stockProductOnClick(null, product)
          this.$emit('item-selected', product)
        }
      } else {
        const itemsFound = this.filterObjectByMultipleKeySearching(val, this.filters, this.list)
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

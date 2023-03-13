class DalManager {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies
    this._console = dependencies.console

    /* Custom Properties */

    /* Assigments */
    this._namespace = '[Server]::[DAL]::[Manager]'
    this._dal = {}
  }

  setup () {
    this._console.success('Loading', { namespace: this._namespace })

    this._dal = require(`${this._dependencies.root}/src/dal/queryConstructor.dal`)

    this._console.success('Loaded', { namespace: this._namespace })
  }

  get types () {
    return {
      string: {
        name: 'string',
        default: '',
        sqlType: 'TEXT'
      },
      number: {
        name: 'number',
        default: 0,
        sqlType: 'INTEGER'
      },
      array: {
        name: 'array',
        default: [],
        sqlType: 'ARRAY'
      },
      object: {
        name: 'object',
        default: {},
        sqlType: 'jsonb'
      },
      timestamp: {
        name: 'date',
        default: (new Date()).getTime() + '',
        sqlType: 'timestamptz'
      },
      date: {
        name: 'date',
        default: new Date(),
        sqlType: 'DATE'
      },
      boolean: {
        name: 'boolean',
        default: false,
        sqlType: 'BOOLEAN'
      },
      serial: {
        name: 'serial',
        default: '',
        sqlType: 'SERIAL'
      },
      bigserial: {
        name: 'bigserial',
        default: '',
        sqlType: 'BIGSERIAL'
      },
      macaddr: {
        name: 'macaddr',
        default: '',
        sqlType: 'macaddr'
      },
      inet: {
        name: 'inet',
        default: '0.0.0.0',
        sqlType: 'inet'
      },
      tsquery: {
        name: 'tsquery',
        default: '',
        sqlType: 'tsquery'
      },
      tsvector: {
        name: 'tsvector',
        default: '',
        sqlType: 'tsvector'
      },
      xml: {
        name: 'xml',
        default: '',
        sqlType: 'xml'
      }
    }
  }
}

DalManager.statuses = {
  inactive: { id: 1, name: 'inactive', title: 'Inactive' },
  active: { id: 2, name: 'active', title: 'Active' },
  deleted: { id: 3, name: 'deleted', title: 'Deleted' }
}

module.exports = { DalManager }

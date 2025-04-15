class HealthService {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies;
    this._database = this._dependencies?.database?.default?.adapter;
    this._models = dependencies.models;
    this._utilities = dependencies.utilities;
    this._console = this._dependencies.console;
    this._firebase = dependencies.firebaseManager;
    this._services = this._dependencies.services;

    /* Custom Properties */
    /* this._myPrivateProperty = 'Some value' */
    this._observability = this._dependencies?.observability?.default?.client;

    /* Assigments */
    /* this._newPrivateObject = new SomeObject(this._dependencies) */
  }

  async get () {
    // TODO: Implement 3 Vectry payloads
    var mutation = this._observability.detectMutation({
      original: { status: 'active', test: { otro: { test: '1', arr: [1, 2, 3] } } },
      updated: { status: 'active', test: { otro: { test: '1', arr: [1, 2] } } }
    })
    const response = await this._observability.capture({
      organization_id: 'org-0551fb033225671',
      namespace: 'inventory.item.updated',
      title: 'Item updated',
      details: 'Item inventory item-9f69908e2b422ed updated',
      actor_id: 'usr-594bb39d19919d5',
      actor_type: 'user',
      operation: {
        type: 'updated',
        system_domain: 'inventory',
        system_entity: 'item',
        system_entity_id: 'item-9f69908e2b422ed',
        source: {
          type: 'user',
          id: 'usr-594bb39d19919d5',
        },
        changes: mutation,
      },
    });
    console.log(response)
    return this._utilities.io.response.success('Server is online');
  }
}

module.exports = HealthService;

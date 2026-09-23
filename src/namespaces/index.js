/**
 * Namespaces of this service (optional).
 *
 * The default namespace is this service's own `src/` tree (routes, services,
 * models, functions…), mounted at `/`. Each namespace declared here is a module
 * with its own routes, services and models (and, if it has them, functions,
 * workers, streams and events), mounted at the prefix you choose.
 *
 * - name:   unique name.
 * - root:   folder of the namespace, relative to `src/`.
 * - prefix: URL prefix; defaults to `/<name>`; '' mounts it at `/`.
 *
 * Each environment can override `enabled` and `prefix` in its configuration:
 * `"namespaces": { "billing": { "enabled": false } }`.
 *
 * The database is not declared here: each service declares it next to its
 * table (`this._databaseName`) and passes it to the database provider.
 */
module.exports = [
  { name: 'catalog', root: 'namespaces/catalog', prefix: '/catalog' },
  { name: 'billing', root: 'namespaces/billing', prefix: '/billing' },
];

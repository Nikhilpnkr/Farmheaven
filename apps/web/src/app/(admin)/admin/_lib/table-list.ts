// Curated allowlist of tables exposed in /admin.
//
// Why a hardcoded list (not pg_tables introspection):
//   - Filters out PostGIS noise (spatial_ref_sys, 8k rows)
//   - Filters out partition children (audit_log_default, sensor_readings_default)
//   - Lets us pick informative list-view columns per table
//   - Lets us group by domain in the sidebar
//
// To add a new table later: append it to its domain group below.

export type AdminTable = {
  name: string;            // exact public.<name>
  label: string;           // sidebar display
  listColumns: string[];   // columns shown in /admin/[table] list (max 5)
  // primary key is always 'id' across this schema, with one known exception:
  // audit_log uses composite (id, occurred_at) since it's range-partitioned.
  // If more exceptions appear, add a pk?: string here and read it in row-detail.
};

export type AdminGroup = {
  label: string;
  tables: AdminTable[];
};

export const ADMIN_GROUPS: AdminGroup[] = [
  {
    label: 'identity',
    tables: [
      { name: 'profiles',    label: 'profiles',    listColumns: ['id', 'full_name', 'phone', 'email', 'is_super_admin'] }, // PII: phone shown
      { name: 'orgs',        label: 'orgs',        listColumns: ['id', 'name', 'owner_id', 'plan', 'created_at'] },
      { name: 'farms',       label: 'farms',       listColumns: ['id', 'name', 'slug', 'org_id', 'total_acres'] },
      { name: 'memberships', label: 'memberships', listColumns: ['id', 'farm_id', 'user_id', 'role', 'is_active'] },
    ],
  },
  {
    label: 'geography',
    tables: [
      { name: 'zones',      label: 'zones',      listColumns: ['id', 'farm_id', 'name', 'kind'] },
      { name: 'plots',      label: 'plots',      listColumns: ['id', 'farm_id', 'name', 'area_acres'] },
      { name: 'structures', label: 'structures', listColumns: ['id', 'farm_id', 'name', 'kind'] },
    ],
  },
  {
    label: 'livestock',
    tables: [
      { name: 'species',          label: 'species',          listColumns: ['code', 'label', 'telugu_label'] },
      { name: 'breeds',           label: 'breeds',           listColumns: ['id', 'species_code', 'label'] },
      { name: 'flocks',           label: 'flocks',           listColumns: ['id', 'farm_id', 'code', 'name', 'species_code'] },
      { name: 'animals',          label: 'animals',          listColumns: ['id', 'farm_id', 'tag', 'species_code', 'health_state'] },
      { name: 'animal_movements', label: 'animal movements', listColumns: ['id', 'farm_id', 'animal_id', 'from_structure_id', 'to_structure_id'] },
      { name: 'health_events',    label: 'health events',    listColumns: ['id', 'farm_id', 'animal_id', 'event_type', 'occurred_at'] },
      { name: 'breeding_events',  label: 'breeding events',  listColumns: ['id', 'farm_id', 'animal_id', 'sire_id', 'event_type'] },
      { name: 'production_events',label: 'production events',listColumns: ['id', 'farm_id', 'animal_id', 'kind', 'occurred_at'] },
      { name: 'lactation_rollups',label: 'lactation rollups',listColumns: ['id', 'farm_id', 'animal_id', 'total_milk_l'] },
      { name: 'flock_fcr_rollups',label: 'flock FCR rollups',listColumns: ['id', 'flock_id', 'period_end', 'fcr'] },
    ],
  },
  {
    label: 'crops',
    tables: [
      { name: 'crops',         label: 'crops',         listColumns: ['id', 'code', 'label', 'family', 'kind'] },
      { name: 'crop_cycles',   label: 'crop cycles',   listColumns: ['id', 'farm_id', 'crop_id', 'plot_id', 'sowing_date'] },
      { name: 'soil_samples',  label: 'soil samples',  listColumns: ['id', 'farm_id', 'plot_id', 'sampled_at'] },
      { name: 'compost_windrows', label: 'compost windrows', listColumns: ['id', 'farm_id', 'code', 'started_at'] },
      { name: 'ipm_logs',      label: 'IPM logs',      listColumns: ['id', 'farm_id', 'plot_id', 'observed_at'] },
      { name: 'remote_sensing_runs', label: 'remote sensing runs', listColumns: ['id', 'farm_id', 'flight_date'] },
    ],
  },
  {
    label: 'inventory',
    tables: [
      { name: 'inventory_lots',      label: 'inventory lots',      listColumns: ['id', 'farm_id', 'sku_id', 'quantity_remaining', 'received_at'] },
      { name: 'inventory_movements', label: 'inventory movements', listColumns: ['id', 'farm_id', 'lot_id', 'quantity', 'occurred_at'] },
      { name: 'suppliers',           label: 'suppliers',           listColumns: ['id', 'farm_id', 'name', 'phone'] }, // PII: phone shown
      { name: 'skus',                label: 'SKUs',                listColumns: ['id', 'farm_id', 'name', 'unit'] },
    ],
  },
  {
    label: 'people',
    tables: [
      { name: 'workers',          label: 'workers',          listColumns: ['id', 'farm_id', 'full_name', 'phone'] }, // PII: phone shown
      { name: 'attendance',       label: 'attendance',       listColumns: ['id', 'farm_id', 'worker_id', 'check_in_at'] },
      { name: 'piece_work_logs',  label: 'piece work logs',  listColumns: ['id', 'farm_id', 'worker_id', 'occurred_at'] },
      { name: 'payroll_runs',     label: 'payroll runs',     listColumns: ['id', 'farm_id', 'period_month', 'status', 'total_net'] },
      { name: 'payslips',         label: 'payslips',         listColumns: ['id', 'farm_id', 'worker_id', 'payroll_run_id'] },
      { name: 'tasks',            label: 'tasks',            listColumns: ['id', 'farm_id', 'title', 'status', 'assigned_worker_id'] },
    ],
  },
  {
    label: 'finance',
    tables: [
      { name: 'transactions',    label: 'transactions',    listColumns: ['id', 'farm_id', 'amount', 'occurred_at'] },
      { name: 'txn_categories',  label: 'txn categories',  listColumns: ['id', 'farm_id', 'label', 'txn_type'] },
      { name: 'cost_centers',    label: 'cost centers',    listColumns: ['id', 'farm_id', 'label'] },
      { name: 'subsidy_schemes', label: 'subsidy schemes', listColumns: ['id', 'label', 'authority'] },
      { name: 'subsidy_claims',  label: 'subsidy claims',  listColumns: ['id', 'farm_id', 'scheme_id', 'amount_approved'] },
    ],
  },
  {
    label: 'commerce',
    tables: [
      { name: 'products',          label: 'products',          listColumns: ['id', 'farm_id', 'name', 'price'] },
      { name: 'customers',         label: 'customers',         listColumns: ['id', 'farm_id', 'full_name', 'phone'] }, // PII: phone shown
      { name: 'customer_addresses',label: 'customer addresses',listColumns: ['id', 'customer_id', 'pincode'] },
      { name: 'customer_events',   label: 'customer events',   listColumns: ['id', 'farm_id', 'customer_id', 'kind'] },
      { name: 'orders',            label: 'orders',            listColumns: ['id', 'farm_id', 'customer_id', 'status', 'total'] },
      { name: 'order_items',       label: 'order items',       listColumns: ['id', 'order_id', 'sku_id', 'quantity'] },
      { name: 'subscriptions',     label: 'subscriptions',     listColumns: ['id', 'farm_id', 'customer_id', 'status'] },
      { name: 'delivery_routes',   label: 'delivery routes',   listColumns: ['id', 'farm_id', 'label'] },
    ],
  },
  {
    label: 'iot',
    tables: [
      { name: 'devices',          label: 'devices',          listColumns: ['id', 'farm_id', 'label', 'kind'] },
      { name: 'device_commands',  label: 'device commands',  listColumns: ['id', 'farm_id', 'device_id', 'queued_at'] },
      { name: 'automation_rules', label: 'automation rules', listColumns: ['id', 'farm_id', 'name'] },
      { name: 'rule_firings',     label: 'rule firings',     listColumns: ['id', 'farm_id', 'rule_id', 'fired_at'] },
    ],
  },
  {
    label: 'compliance',
    tables: [
      // note: composite PK (id, occurred_at) — partitioned; row-detail by id alone may return multiple rows in theory
      { name: 'audit_log',             label: 'audit log',             listColumns: ['id', 'farm_id', 'actor_id', 'action', 'occurred_at'] },
      { name: 'welfare_events',        label: 'welfare events',        listColumns: ['id', 'farm_id', 'signal', 'observed_at'] },
      { name: 'welfare_rollups',       label: 'welfare rollups',       listColumns: ['id', 'farm_id'] },
      { name: 'carbon_entries',        label: 'carbon entries',        listColumns: ['id', 'farm_id', 'source_kind', 'tco2e'] },
      { name: 'farm_certifications',   label: 'farm certifications',   listColumns: ['id', 'farm_id', 'body_id'] },
      { name: 'certification_bodies',  label: 'certification bodies',  listColumns: ['id', 'code', 'label', 'scheme'] },
    ],
  },
];

// Flat lookup, built once at module load.
const TABLE_INDEX: Map<string, AdminTable> = new Map(
  ADMIN_GROUPS.flatMap((g) => g.tables.map((t) => [t.name, t] as const)),
);

export function findTable(name: string): AdminTable | undefined {
  return TABLE_INDEX.get(name);
}

export function isAllowedTable(name: string): boolean {
  return TABLE_INDEX.has(name);
}

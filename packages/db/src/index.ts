// Re-export everything app code might need from a single symbol.
// Apps should import from specific subpaths instead (./server, ./client, ./admin)
// to keep bundle sizes honest. This root export is for convenience + types only.

export type { Database, Json, Tables, TablesInsert, TablesUpdate, Enums } from './types';
export * from './schemas';

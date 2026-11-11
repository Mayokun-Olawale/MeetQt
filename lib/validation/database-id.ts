import { z } from "zod";

// PostgreSQL accepts UUID values without RFC version/variant restrictions,
// including deterministic IDs used by our demo fixtures.
export const databaseId = z.guid();

/**
 * RETIRED: Bidirectional / Firestore-to-Supabase replication has been permanently retired.
 * Cloud Firestore is now the single authoritative database.
 * See src/server/migrateSupabaseToFirestore.ts for one-way legacy inspection & backup.
 */
export async function runSupabaseDataTransfer(): Promise<{
  success: boolean;
  retired: boolean;
  transferred: Record<string, number>;
  errors: string[];
}> {
  return {
    success: true,
    retired: true,
    transferred: { profiles: 0, exerciseMedia: 0, programSchedules: 0, printablePdfProducts: 0 },
    errors: []
  };
}

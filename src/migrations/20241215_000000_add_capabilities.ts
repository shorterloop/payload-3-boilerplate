import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    -- Add capabilities_id column to payload_locked_documents_rels if it doesn't exist
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "capabilities_id" integer;
    EXCEPTION
      WHEN duplicate_column THEN null;
    END $$;
    
    -- Add foreign key constraint if capabilities table exists
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'capabilities') THEN
        ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_capabilities_fk" FOREIGN KEY ("capabilities_id") REFERENCES "public"."capabilities"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
    
    -- Create index
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_capabilities_id_idx" ON "payload_locked_documents_rels" USING btree ("capabilities_id");
  `)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_capabilities_fk";
    
    DROP INDEX IF EXISTS "payload_locked_documents_rels_capabilities_id_idx";
    
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "capabilities_id";
  `)
}


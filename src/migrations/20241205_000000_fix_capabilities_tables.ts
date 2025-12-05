import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    -- Create ENUM types for capabilities
    DO $$ BEGIN
      CREATE TYPE "public"."enum_capabilities_status" AS ENUM('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__capabilities_v_version_status" AS ENUM('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    -- Main capabilities table
    CREATE TABLE IF NOT EXISTS "capabilities" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar,
      "slug" varchar,
      "hero_headline" varchar,
      "hero_subheadline" jsonb,
      "hero_hero_image_id" integer,
      "hero_primary_cta_text" varchar,
      "hero_primary_cta_link" varchar,
      "seo_title" varchar,
      "seo_description" jsonb,
      "og_image_id" integer,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "_status" "enum_capabilities_status" DEFAULT 'draft'
    );

    -- Block: problemSection - painPoints array
    CREATE TABLE IF NOT EXISTS "capabilities_blocks_problem_section_pain_points" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar,
      "description" jsonb,
      "icon" varchar
    );

    -- Block: problemSection
    CREATE TABLE IF NOT EXISTS "capabilities_blocks_problem_section" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "headline" varchar,
      "block_name" varchar
    );

    -- Block: howItWorks - steps array
    CREATE TABLE IF NOT EXISTS "capabilities_blocks_how_it_works_steps" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "step_number" varchar,
      "title" varchar,
      "description" jsonb,
      "step_image_id" integer
    );

    -- Block: howItWorks
    CREATE TABLE IF NOT EXISTS "capabilities_blocks_how_it_works" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "headline" varchar,
      "block_name" varchar
    );

    -- Block: featureGrid - features - benefits (nested array)
    CREATE TABLE IF NOT EXISTS "capabilities_blocks_feature_grid_features_benefits" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "item" varchar
    );

    -- Block: featureGrid - features array
    CREATE TABLE IF NOT EXISTS "capabilities_blocks_feature_grid_features" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar,
      "description" jsonb,
      "screenshot_id" integer
    );

    -- Block: featureGrid
    CREATE TABLE IF NOT EXISTS "capabilities_blocks_feature_grid" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "headline" varchar,
      "block_name" varchar
    );

    -- Block: useCases - cases array
    CREATE TABLE IF NOT EXISTS "capabilities_blocks_use_cases_cases" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "persona" varchar,
      "scenario" jsonb,
      "outcome" jsonb,
      "image_id" integer
    );

    -- Block: useCases
    CREATE TABLE IF NOT EXISTS "capabilities_blocks_use_cases" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "headline" varchar,
      "block_name" varchar
    );

    -- Block: comparisonTable - rows array
    CREATE TABLE IF NOT EXISTS "capabilities_blocks_comparison_table_rows" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "feature" varchar,
      "value_a" varchar,
      "value_b" varchar
    );

    -- Block: comparisonTable
    CREATE TABLE IF NOT EXISTS "capabilities_blocks_comparison_table" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "headline" varchar,
      "subheadline" jsonb,
      "block_name" varchar
    );

    -- Block: testimonials - quotes array
    CREATE TABLE IF NOT EXISTS "capabilities_blocks_testimonials_quotes" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "quote" jsonb,
      "author" varchar,
      "author_title" varchar,
      "avatar_id" integer
    );

    -- Block: testimonials
    CREATE TABLE IF NOT EXISTS "capabilities_blocks_testimonials" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "headline" varchar,
      "block_name" varchar
    );

    -- Block: ctaSection
    CREATE TABLE IF NOT EXISTS "capabilities_blocks_cta_section" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "headline" varchar,
      "subheadline" jsonb,
      "primary_cta_text" varchar,
      "primary_cta_link" varchar,
      "block_name" varchar
    );

    -- Block: richTextSection
    CREATE TABLE IF NOT EXISTS "capabilities_blocks_rich_text_section" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "content" jsonb,
      "block_name" varchar
    );

    -- ============================================
    -- VERSIONED TABLES (prefixed with _)
    -- ============================================

    -- Main versioned capabilities table
    CREATE TABLE IF NOT EXISTS "_capabilities_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer,
      "version_title" varchar,
      "version_slug" varchar,
      "version_hero_headline" varchar,
      "version_hero_subheadline" jsonb,
      "version_hero_hero_image_id" integer,
      "version_hero_primary_cta_text" varchar,
      "version_hero_primary_cta_link" varchar,
      "version_seo_title" varchar,
      "version_seo_description" jsonb,
      "version_og_image_id" integer,
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "version__status" "enum__capabilities_v_version_status" DEFAULT 'draft',
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest" boolean,
      "autosave" boolean
    );

    -- Versioned Block: problemSection - painPoints array
    CREATE TABLE IF NOT EXISTS "_capabilities_v_blocks_problem_section_pain_points" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar,
      "description" jsonb,
      "icon" varchar,
      "_uuid" varchar
    );

    -- Versioned Block: problemSection
    CREATE TABLE IF NOT EXISTS "_capabilities_v_blocks_problem_section" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "headline" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );

    -- Versioned Block: howItWorks - steps array
    CREATE TABLE IF NOT EXISTS "_capabilities_v_blocks_how_it_works_steps" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "step_number" varchar,
      "title" varchar,
      "description" jsonb,
      "step_image_id" integer,
      "_uuid" varchar
    );

    -- Versioned Block: howItWorks
    CREATE TABLE IF NOT EXISTS "_capabilities_v_blocks_how_it_works" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "headline" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );

    -- Versioned Block: featureGrid - features - benefits (nested array)
    CREATE TABLE IF NOT EXISTS "_capabilities_v_blocks_feature_grid_features_benefits" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "item" varchar,
      "_uuid" varchar
    );

    -- Versioned Block: featureGrid - features array
    CREATE TABLE IF NOT EXISTS "_capabilities_v_blocks_feature_grid_features" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar,
      "description" jsonb,
      "screenshot_id" integer,
      "_uuid" varchar
    );

    -- Versioned Block: featureGrid
    CREATE TABLE IF NOT EXISTS "_capabilities_v_blocks_feature_grid" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "headline" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );

    -- Versioned Block: useCases - cases array
    CREATE TABLE IF NOT EXISTS "_capabilities_v_blocks_use_cases_cases" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "persona" varchar,
      "scenario" jsonb,
      "outcome" jsonb,
      "image_id" integer,
      "_uuid" varchar
    );

    -- Versioned Block: useCases
    CREATE TABLE IF NOT EXISTS "_capabilities_v_blocks_use_cases" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "headline" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );

    -- Versioned Block: comparisonTable - rows array
    CREATE TABLE IF NOT EXISTS "_capabilities_v_blocks_comparison_table_rows" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "feature" varchar,
      "value_a" varchar,
      "value_b" varchar,
      "_uuid" varchar
    );

    -- Versioned Block: comparisonTable
    CREATE TABLE IF NOT EXISTS "_capabilities_v_blocks_comparison_table" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "headline" varchar,
      "subheadline" jsonb,
      "_uuid" varchar,
      "block_name" varchar
    );

    -- Versioned Block: testimonials - quotes array
    CREATE TABLE IF NOT EXISTS "_capabilities_v_blocks_testimonials_quotes" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "quote" jsonb,
      "author" varchar,
      "author_title" varchar,
      "avatar_id" integer,
      "_uuid" varchar
    );

    -- Versioned Block: testimonials
    CREATE TABLE IF NOT EXISTS "_capabilities_v_blocks_testimonials" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "headline" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );

    -- Versioned Block: ctaSection
    CREATE TABLE IF NOT EXISTS "_capabilities_v_blocks_cta_section" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "headline" varchar,
      "subheadline" jsonb,
      "primary_cta_text" varchar,
      "primary_cta_link" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );

    -- Versioned Block: richTextSection
    CREATE TABLE IF NOT EXISTS "_capabilities_v_blocks_rich_text_section" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "content" jsonb,
      "_uuid" varchar,
      "block_name" varchar
    );

    -- ============================================
    -- INDEXES
    -- ============================================

    -- Main table indexes
    CREATE INDEX IF NOT EXISTS "capabilities_hero_hero_image_idx" ON "capabilities" USING btree ("hero_hero_image_id");
    CREATE INDEX IF NOT EXISTS "capabilities_og_image_idx" ON "capabilities" USING btree ("og_image_id");
    CREATE INDEX IF NOT EXISTS "capabilities_slug_idx" ON "capabilities" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "capabilities_updated_at_idx" ON "capabilities" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "capabilities_created_at_idx" ON "capabilities" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "capabilities__status_idx" ON "capabilities" USING btree ("_status");

    -- Block array indexes
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_problem_section_pain_points_order_idx" ON "capabilities_blocks_problem_section_pain_points" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_problem_section_pain_points_parent_id_idx" ON "capabilities_blocks_problem_section_pain_points" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_problem_section_order_idx" ON "capabilities_blocks_problem_section" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_problem_section_parent_id_idx" ON "capabilities_blocks_problem_section" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_problem_section_path_idx" ON "capabilities_blocks_problem_section" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "capabilities_blocks_how_it_works_steps_order_idx" ON "capabilities_blocks_how_it_works_steps" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_how_it_works_steps_parent_id_idx" ON "capabilities_blocks_how_it_works_steps" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_how_it_works_order_idx" ON "capabilities_blocks_how_it_works" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_how_it_works_parent_id_idx" ON "capabilities_blocks_how_it_works" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_how_it_works_path_idx" ON "capabilities_blocks_how_it_works" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "capabilities_blocks_feature_grid_features_benefits_order_idx" ON "capabilities_blocks_feature_grid_features_benefits" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_feature_grid_features_benefits_parent_id_idx" ON "capabilities_blocks_feature_grid_features_benefits" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_feature_grid_features_order_idx" ON "capabilities_blocks_feature_grid_features" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_feature_grid_features_parent_id_idx" ON "capabilities_blocks_feature_grid_features" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_feature_grid_order_idx" ON "capabilities_blocks_feature_grid" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_feature_grid_parent_id_idx" ON "capabilities_blocks_feature_grid" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_feature_grid_path_idx" ON "capabilities_blocks_feature_grid" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "capabilities_blocks_use_cases_cases_order_idx" ON "capabilities_blocks_use_cases_cases" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_use_cases_cases_parent_id_idx" ON "capabilities_blocks_use_cases_cases" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_use_cases_order_idx" ON "capabilities_blocks_use_cases" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_use_cases_parent_id_idx" ON "capabilities_blocks_use_cases" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_use_cases_path_idx" ON "capabilities_blocks_use_cases" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "capabilities_blocks_comparison_table_rows_order_idx" ON "capabilities_blocks_comparison_table_rows" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_comparison_table_rows_parent_id_idx" ON "capabilities_blocks_comparison_table_rows" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_comparison_table_order_idx" ON "capabilities_blocks_comparison_table" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_comparison_table_parent_id_idx" ON "capabilities_blocks_comparison_table" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_comparison_table_path_idx" ON "capabilities_blocks_comparison_table" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "capabilities_blocks_testimonials_quotes_order_idx" ON "capabilities_blocks_testimonials_quotes" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_testimonials_quotes_parent_id_idx" ON "capabilities_blocks_testimonials_quotes" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_testimonials_order_idx" ON "capabilities_blocks_testimonials" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_testimonials_parent_id_idx" ON "capabilities_blocks_testimonials" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_testimonials_path_idx" ON "capabilities_blocks_testimonials" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "capabilities_blocks_cta_section_order_idx" ON "capabilities_blocks_cta_section" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_cta_section_parent_id_idx" ON "capabilities_blocks_cta_section" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_cta_section_path_idx" ON "capabilities_blocks_cta_section" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "capabilities_blocks_rich_text_section_order_idx" ON "capabilities_blocks_rich_text_section" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_rich_text_section_parent_id_idx" ON "capabilities_blocks_rich_text_section" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "capabilities_blocks_rich_text_section_path_idx" ON "capabilities_blocks_rich_text_section" USING btree ("_path");

    -- Versioned table indexes
    CREATE INDEX IF NOT EXISTS "_capabilities_v_parent_idx" ON "_capabilities_v" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_version_hero_hero_image_idx" ON "_capabilities_v" USING btree ("version_hero_hero_image_id");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_version_og_image_idx" ON "_capabilities_v" USING btree ("version_og_image_id");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_version_version_slug_idx" ON "_capabilities_v" USING btree ("version_slug");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_version_updated_at_idx" ON "_capabilities_v" USING btree ("version_updated_at");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_version_created_at_idx" ON "_capabilities_v" USING btree ("version_created_at");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_version__status_idx" ON "_capabilities_v" USING btree ("version__status");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_created_at_idx" ON "_capabilities_v" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_updated_at_idx" ON "_capabilities_v" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_latest_idx" ON "_capabilities_v" USING btree ("latest");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_autosave_idx" ON "_capabilities_v" USING btree ("autosave");

    -- Versioned block array indexes
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_problem_section_pain_points_order_idx" ON "_capabilities_v_blocks_problem_section_pain_points" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_problem_section_pain_points_parent_id_idx" ON "_capabilities_v_blocks_problem_section_pain_points" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_problem_section_order_idx" ON "_capabilities_v_blocks_problem_section" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_problem_section_parent_id_idx" ON "_capabilities_v_blocks_problem_section" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_problem_section_path_idx" ON "_capabilities_v_blocks_problem_section" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_how_it_works_steps_order_idx" ON "_capabilities_v_blocks_how_it_works_steps" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_how_it_works_steps_parent_id_idx" ON "_capabilities_v_blocks_how_it_works_steps" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_how_it_works_order_idx" ON "_capabilities_v_blocks_how_it_works" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_how_it_works_parent_id_idx" ON "_capabilities_v_blocks_how_it_works" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_how_it_works_path_idx" ON "_capabilities_v_blocks_how_it_works" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_feature_grid_features_benefits_order_idx" ON "_capabilities_v_blocks_feature_grid_features_benefits" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_feature_grid_features_benefits_parent_id_idx" ON "_capabilities_v_blocks_feature_grid_features_benefits" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_feature_grid_features_order_idx" ON "_capabilities_v_blocks_feature_grid_features" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_feature_grid_features_parent_id_idx" ON "_capabilities_v_blocks_feature_grid_features" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_feature_grid_order_idx" ON "_capabilities_v_blocks_feature_grid" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_feature_grid_parent_id_idx" ON "_capabilities_v_blocks_feature_grid" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_feature_grid_path_idx" ON "_capabilities_v_blocks_feature_grid" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_use_cases_cases_order_idx" ON "_capabilities_v_blocks_use_cases_cases" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_use_cases_cases_parent_id_idx" ON "_capabilities_v_blocks_use_cases_cases" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_use_cases_order_idx" ON "_capabilities_v_blocks_use_cases" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_use_cases_parent_id_idx" ON "_capabilities_v_blocks_use_cases" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_use_cases_path_idx" ON "_capabilities_v_blocks_use_cases" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_comparison_table_rows_order_idx" ON "_capabilities_v_blocks_comparison_table_rows" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_comparison_table_rows_parent_id_idx" ON "_capabilities_v_blocks_comparison_table_rows" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_comparison_table_order_idx" ON "_capabilities_v_blocks_comparison_table" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_comparison_table_parent_id_idx" ON "_capabilities_v_blocks_comparison_table" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_comparison_table_path_idx" ON "_capabilities_v_blocks_comparison_table" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_testimonials_quotes_order_idx" ON "_capabilities_v_blocks_testimonials_quotes" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_testimonials_quotes_parent_id_idx" ON "_capabilities_v_blocks_testimonials_quotes" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_testimonials_order_idx" ON "_capabilities_v_blocks_testimonials" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_testimonials_parent_id_idx" ON "_capabilities_v_blocks_testimonials" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_testimonials_path_idx" ON "_capabilities_v_blocks_testimonials" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_cta_section_order_idx" ON "_capabilities_v_blocks_cta_section" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_cta_section_parent_id_idx" ON "_capabilities_v_blocks_cta_section" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_cta_section_path_idx" ON "_capabilities_v_blocks_cta_section" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_rich_text_section_order_idx" ON "_capabilities_v_blocks_rich_text_section" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_rich_text_section_parent_id_idx" ON "_capabilities_v_blocks_rich_text_section" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_capabilities_v_blocks_rich_text_section_path_idx" ON "_capabilities_v_blocks_rich_text_section" USING btree ("_path");

    -- ============================================
    -- FOREIGN KEYS
    -- ============================================

    -- Main table foreign keys
    DO $$ BEGIN
      ALTER TABLE "capabilities" ADD CONSTRAINT "capabilities_hero_hero_image_id_media_id_fk" FOREIGN KEY ("hero_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "capabilities" ADD CONSTRAINT "capabilities_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    -- Block foreign keys
    DO $$ BEGIN
      ALTER TABLE "capabilities_blocks_problem_section_pain_points" ADD CONSTRAINT "capabilities_blocks_problem_section_pain_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."capabilities_blocks_problem_section"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "capabilities_blocks_problem_section" ADD CONSTRAINT "capabilities_blocks_problem_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."capabilities"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "capabilities_blocks_how_it_works_steps" ADD CONSTRAINT "capabilities_blocks_how_it_works_steps_step_image_id_fk" FOREIGN KEY ("step_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "capabilities_blocks_how_it_works_steps" ADD CONSTRAINT "capabilities_blocks_how_it_works_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."capabilities_blocks_how_it_works"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "capabilities_blocks_how_it_works" ADD CONSTRAINT "capabilities_blocks_how_it_works_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."capabilities"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "capabilities_blocks_feature_grid_features_benefits" ADD CONSTRAINT "capabilities_blocks_feature_grid_features_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."capabilities_blocks_feature_grid_features"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "capabilities_blocks_feature_grid_features" ADD CONSTRAINT "capabilities_blocks_feature_grid_features_screenshot_id_fk" FOREIGN KEY ("screenshot_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "capabilities_blocks_feature_grid_features" ADD CONSTRAINT "capabilities_blocks_feature_grid_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."capabilities_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "capabilities_blocks_feature_grid" ADD CONSTRAINT "capabilities_blocks_feature_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."capabilities"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "capabilities_blocks_use_cases_cases" ADD CONSTRAINT "capabilities_blocks_use_cases_cases_image_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "capabilities_blocks_use_cases_cases" ADD CONSTRAINT "capabilities_blocks_use_cases_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."capabilities_blocks_use_cases"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "capabilities_blocks_use_cases" ADD CONSTRAINT "capabilities_blocks_use_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."capabilities"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "capabilities_blocks_comparison_table_rows" ADD CONSTRAINT "capabilities_blocks_comparison_table_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."capabilities_blocks_comparison_table"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "capabilities_blocks_comparison_table" ADD CONSTRAINT "capabilities_blocks_comparison_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."capabilities"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "capabilities_blocks_testimonials_quotes" ADD CONSTRAINT "capabilities_blocks_testimonials_quotes_avatar_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "capabilities_blocks_testimonials_quotes" ADD CONSTRAINT "capabilities_blocks_testimonials_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."capabilities_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "capabilities_blocks_testimonials" ADD CONSTRAINT "capabilities_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."capabilities"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "capabilities_blocks_cta_section" ADD CONSTRAINT "capabilities_blocks_cta_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."capabilities"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "capabilities_blocks_rich_text_section" ADD CONSTRAINT "capabilities_blocks_rich_text_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."capabilities"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    -- Versioned table foreign keys
    DO $$ BEGIN
      ALTER TABLE "_capabilities_v" ADD CONSTRAINT "_capabilities_v_parent_id_capabilities_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."capabilities"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_capabilities_v" ADD CONSTRAINT "_capabilities_v_version_hero_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_capabilities_v" ADD CONSTRAINT "_capabilities_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_capabilities_v_blocks_problem_section_pain_points" ADD CONSTRAINT "_capabilities_v_blocks_problem_section_pain_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_capabilities_v_blocks_problem_section"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_capabilities_v_blocks_problem_section" ADD CONSTRAINT "_capabilities_v_blocks_problem_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_capabilities_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_capabilities_v_blocks_how_it_works_steps" ADD CONSTRAINT "_capabilities_v_blocks_how_it_works_steps_step_image_id_fk" FOREIGN KEY ("step_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_capabilities_v_blocks_how_it_works_steps" ADD CONSTRAINT "_capabilities_v_blocks_how_it_works_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_capabilities_v_blocks_how_it_works"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_capabilities_v_blocks_how_it_works" ADD CONSTRAINT "_capabilities_v_blocks_how_it_works_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_capabilities_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_capabilities_v_blocks_feature_grid_features_benefits" ADD CONSTRAINT "_capabilities_v_blocks_feature_grid_features_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_capabilities_v_blocks_feature_grid_features"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_capabilities_v_blocks_feature_grid_features" ADD CONSTRAINT "_capabilities_v_blocks_feature_grid_features_screenshot_id_fk" FOREIGN KEY ("screenshot_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_capabilities_v_blocks_feature_grid_features" ADD CONSTRAINT "_capabilities_v_blocks_feature_grid_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_capabilities_v_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_capabilities_v_blocks_feature_grid" ADD CONSTRAINT "_capabilities_v_blocks_feature_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_capabilities_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_capabilities_v_blocks_use_cases_cases" ADD CONSTRAINT "_capabilities_v_blocks_use_cases_cases_image_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_capabilities_v_blocks_use_cases_cases" ADD CONSTRAINT "_capabilities_v_blocks_use_cases_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_capabilities_v_blocks_use_cases"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_capabilities_v_blocks_use_cases" ADD CONSTRAINT "_capabilities_v_blocks_use_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_capabilities_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_capabilities_v_blocks_comparison_table_rows" ADD CONSTRAINT "_capabilities_v_blocks_comparison_table_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_capabilities_v_blocks_comparison_table"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_capabilities_v_blocks_comparison_table" ADD CONSTRAINT "_capabilities_v_blocks_comparison_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_capabilities_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_capabilities_v_blocks_testimonials_quotes" ADD CONSTRAINT "_capabilities_v_blocks_testimonials_quotes_avatar_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_capabilities_v_blocks_testimonials_quotes" ADD CONSTRAINT "_capabilities_v_blocks_testimonials_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_capabilities_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_capabilities_v_blocks_testimonials" ADD CONSTRAINT "_capabilities_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_capabilities_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_capabilities_v_blocks_cta_section" ADD CONSTRAINT "_capabilities_v_blocks_cta_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_capabilities_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_capabilities_v_blocks_rich_text_section" ADD CONSTRAINT "_capabilities_v_blocks_rich_text_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_capabilities_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    -- Add capabilities_id to payload_locked_documents_rels if not exists
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "capabilities_id" integer;
    EXCEPTION WHEN duplicate_column THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_capabilities_fk" FOREIGN KEY ("capabilities_id") REFERENCES "public"."capabilities"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_capabilities_id_idx" ON "payload_locked_documents_rels" USING btree ("capabilities_id");
  `)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
    -- Drop foreign keys first
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_capabilities_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_capabilities_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "capabilities_id";

    -- Drop versioned block tables
    DROP TABLE IF EXISTS "_capabilities_v_blocks_rich_text_section" CASCADE;
    DROP TABLE IF EXISTS "_capabilities_v_blocks_cta_section" CASCADE;
    DROP TABLE IF EXISTS "_capabilities_v_blocks_testimonials_quotes" CASCADE;
    DROP TABLE IF EXISTS "_capabilities_v_blocks_testimonials" CASCADE;
    DROP TABLE IF EXISTS "_capabilities_v_blocks_comparison_table_rows" CASCADE;
    DROP TABLE IF EXISTS "_capabilities_v_blocks_comparison_table" CASCADE;
    DROP TABLE IF EXISTS "_capabilities_v_blocks_use_cases_cases" CASCADE;
    DROP TABLE IF EXISTS "_capabilities_v_blocks_use_cases" CASCADE;
    DROP TABLE IF EXISTS "_capabilities_v_blocks_feature_grid_features_benefits" CASCADE;
    DROP TABLE IF EXISTS "_capabilities_v_blocks_feature_grid_features" CASCADE;
    DROP TABLE IF EXISTS "_capabilities_v_blocks_feature_grid" CASCADE;
    DROP TABLE IF EXISTS "_capabilities_v_blocks_how_it_works_steps" CASCADE;
    DROP TABLE IF EXISTS "_capabilities_v_blocks_how_it_works" CASCADE;
    DROP TABLE IF EXISTS "_capabilities_v_blocks_problem_section_pain_points" CASCADE;
    DROP TABLE IF EXISTS "_capabilities_v_blocks_problem_section" CASCADE;
    DROP TABLE IF EXISTS "_capabilities_v" CASCADE;

    -- Drop main block tables
    DROP TABLE IF EXISTS "capabilities_blocks_rich_text_section" CASCADE;
    DROP TABLE IF EXISTS "capabilities_blocks_cta_section" CASCADE;
    DROP TABLE IF EXISTS "capabilities_blocks_testimonials_quotes" CASCADE;
    DROP TABLE IF EXISTS "capabilities_blocks_testimonials" CASCADE;
    DROP TABLE IF EXISTS "capabilities_blocks_comparison_table_rows" CASCADE;
    DROP TABLE IF EXISTS "capabilities_blocks_comparison_table" CASCADE;
    DROP TABLE IF EXISTS "capabilities_blocks_use_cases_cases" CASCADE;
    DROP TABLE IF EXISTS "capabilities_blocks_use_cases" CASCADE;
    DROP TABLE IF EXISTS "capabilities_blocks_feature_grid_features_benefits" CASCADE;
    DROP TABLE IF EXISTS "capabilities_blocks_feature_grid_features" CASCADE;
    DROP TABLE IF EXISTS "capabilities_blocks_feature_grid" CASCADE;
    DROP TABLE IF EXISTS "capabilities_blocks_how_it_works_steps" CASCADE;
    DROP TABLE IF EXISTS "capabilities_blocks_how_it_works" CASCADE;
    DROP TABLE IF EXISTS "capabilities_blocks_problem_section_pain_points" CASCADE;
    DROP TABLE IF EXISTS "capabilities_blocks_problem_section" CASCADE;
    DROP TABLE IF EXISTS "capabilities" CASCADE;

    -- Drop enum types
    DROP TYPE IF EXISTS "public"."enum__capabilities_v_version_status";
    DROP TYPE IF EXISTS "public"."enum_capabilities_status";
  `)
}

CREATE TABLE
    "agents" (
                 "id" SERIAL NOT NULL,
                 "account_id" TEXT NOT NULL,
                 "name" TEXT NOT NULL,
                 "display_name" TEXT,
                 "preferred_provider" TEXT,
                 "preferred_model" TEXT,
                 "input_adaptor" TEXT,
                 "output_adaptor" TEXT,
                 "prompt" TEXT,
                 "variables" TEXT,
                 "component" TEXT,
                 "logo_url" TEXT,
                 "tools" JSONB,
                 "properties" JSONB,
                 PRIMARY KEY ("id")
);

ALTER TABLE "agents" ADD CONSTRAINT "unique_name" UNIQUE ("account_id", "name");
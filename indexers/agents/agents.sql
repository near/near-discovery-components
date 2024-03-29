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

-- commented lines are features that are not supported by context.db but are in the table
-- that was created in the db
CREATE TABLE "entities"
(
    "id" SERIAL NOT NULL,
    "entity_type"  TEXT NOT NULL,
    "account_id"   TEXT NOT NULL,
    "name"         TEXT NOT NULL,
    "display_name" TEXT,
    "logo_url"     TEXT,
    "attributes"   JSONB,
    "stars"        integer, -- default 0
    -- "created_at"   timestamp with time zone default now(),
    -- "updated_at"   timestamp with time zone default now(),
    PRIMARY KEY ("entity_type", "account_id", "name")
);

-- CREATE TRIGGER set_dataplatform_near_agents_entities_updated_at
--     BEFORE UPDATE
--     ON dataplatform_near_agents.entities
--     FOR EACH ROW
-- EXECUTE FUNCTION dataplatform_near_agents.set_current_timestamp_updated_at();
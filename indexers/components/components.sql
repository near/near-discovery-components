CREATE TABLE
    "versions" (
                   "id" SERIAL PRIMARY KEY,
                   "block_height" INT NOT NULL,
                   "block_timestamp_ms" BIGINT NOT NULL,
                   "code" VARCHAR NOT NULL,
                   "component_author_id" VARCHAR NOT NULL,
                   "component_name" VARCHAR NOT NULL,
                   "lines_added" INT NOT NULL,
                   "lines_removed" INT NOT NULL,
                   "receipt_id" VARCHAR NOT NULL
);

CREATE UNIQUE INDEX idx_versions_receipt_id ON versions (receipt_id);

CREATE INDEX
    idx_versions_component_author_id ON versions (component_author_id);

CREATE INDEX
    idx_versions_component_name ON versions (component_name);

CREATE INDEX
    idx_versions_block_height ON versions (block_height);

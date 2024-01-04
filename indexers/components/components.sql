CREATE TABLE
  "versions" (
    "id" SERIAL,
    "block_height" BIGINT NOT NULL,
    "block_timestamp_ms" BIGINT NOT NULL,
    "code" VARCHAR NOT NULL,
    "component_author_id" VARCHAR NOT NULL,
    "component_name" VARCHAR NOT NULL,
    "lines_added" INT NOT NULL,
    "lines_removed" INT NOT NULL,
    "receipt_id" VARCHAR NOT NULL,
    "name" VARCHAR,
    "image_ipfs_cid" VARCHAR,
    "description" VARCHAR,
    "fork_of_source" VARCHAR,
    "fork_of_block_height" BIGINT,
    "tags" VARCHAR,
    "website" VARCHAR,
    PRIMARY KEY ("id")
  );

CREATE UNIQUE INDEX idx_versions_unique_receipt_version ON versions (receipt_id, component_author_id, component_name);

CREATE INDEX
  idx_versions_component_author_id_component_name ON versions (component_author_id, component_name);

CREATE INDEX
  idx_versions_block_height ON versions (block_height);

CREATE INDEX
  idx_versions_fork_of ON versions (fork_of_source);
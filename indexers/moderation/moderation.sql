CREATE TABLE
    "moderation_decisions" (
                               "group" text NOT NULL,
                               "moderator_account_id" text NOT NULL,
                               "moderated_account_id" text NOT NULL,
                               "moderated_path" text NULL,
                               "moderated_blockheight" integer NULL,
                               "base_content_account" text NULL, -- original poster when comment is being moderated
                               "base_content_path" text NULL, -- /post/main, /post/comment, etc
                               "base_content_blockheight" text NULL, -- original post blockheight
                               "label" text NOT NULL,
                               "expiration" timestamp NULL,
                               "notes" text NULL
);

CREATE INDEX
    moderation_decisions_content_idx ON moderation_decisions (
                                                              "moderated_account_id",
                                                              "moderated_path",
                                                              "moderated_blockheight"
    );

CREATE TABLE
    "moderation_reporting" (
                               "group" text NOT NULL,
                               "account_id" text NOT NULL,
                               "moderated_account_id" text NOT NULL,
                               "moderated_path" text NULL,
                               "moderated_blockheight" integer NULL,
                               "base_content_account" text NULL, -- original poster when comment is being moderated
                               "base_content_path" text NULL, -- /post/main, /post/comment, etc
                               "base_content_blockheight" text NULL, -- original post blockheight
                               "label" text NOT NULL,
                               "expiration" timestamp NULL,
                               "notes" text NULL
);

CREATE INDEX
    moderation_reporting_content_idx ON moderation_reporting (
                                                              "moderated_account_id",
                                                              "moderated_path",
                                                              "moderated_blockheight"
    );

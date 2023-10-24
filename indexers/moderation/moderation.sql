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

CREATE VIEW dataplatform_near_moderation.unmoderated_reports as
SELECT min(report_blockheight) as first_report_blockheight, count(account_id) as reporter_count,
       array(select account_id from dataplatform_near_moderation.moderation_reporting rl
             where rl.moderated_account_id = r.moderated_account_id
               and rl.moderated_path = r.moderated_path and rl.moderated_blockheight = r.moderated_blockheight limit 5) as reporter_list,
       moderated_account_id, moderated_path, moderated_blockheight,
       mode() within group (order by label) as most_frequent_label --  most prevalent label
FROM dataplatform_near_moderation.moderation_reporting r
WHERE NOT EXISTS (
    SELECT * FROM dataplatform_near_moderation.moderation_decisions d
    WHERE r.moderated_account_id = d.moderated_account_id
      AND (d.moderated_path IS NULL OR (d.moderated_path = r.moderated_path AND r.moderated_blockheight = d.moderated_blockheight))
)
  AND r.label != 'hide'
GROUP by moderated_account_id, moderated_path, moderated_blockheight;

CREATE VIEW dataplatform_near_moderation.needs_moderation as
SELECT r.most_frequent_label, r.first_report_blockheight, r.reporter_count, r.reporter_list, r.moderated_path, p.account_id, p.block_height, p.block_timestamp, p.receipt_id, p.content
FROM dataplatform_near_moderation.unmoderated_reports as r
         INNER JOIN dataplatform_near_social_feed.posts p
                    ON p.account_id = r.moderated_account_id AND r.moderated_blockheight = p.block_height AND r.moderated_path = '/post/main'
UNION
SELECT r.most_frequent_label, r.first_report_blockheight, r.reporter_count, r.reporter_list, r.moderated_path, c.account_id, c.block_height, c.block_timestamp, c.receipt_id, c.content
FROM dataplatform_near_moderation.unmoderated_reports as r
         INNER JOIN dataplatform_near_social_feed.comments c
                    ON c.account_id = r.moderated_account_id AND r.moderated_blockheight = c.block_height AND r.moderated_path = '/post/comment'
UNION
SELECT r.most_frequent_label, r.first_report_blockheight, r.reporter_count, r.reporter_list, null as moderated_path, moderated_account_id as account_id, null as block_height, null as block_timestamp, null as receipt_id, null as content
FROM dataplatform_near_moderation.unmoderated_reports as r
WHERE r.moderated_path is null
ORDER BY block_height DESC;
CREATE VIEW moderated_posts as
SELECT * FROM dataplatform_near_social_feed.posts p
WHERE NOT EXISTS (
    SELECT * FROM dataplatform_near_moderation.moderation_decisions d
    WHERE p.account_id = d.moderated_account_id
      AND (d.moderated_path IS NULL OR (d.moderated_path = '/post/main' AND d.moderated_blockheight = p.block_height))
);

CREATE VIEW moderated_comments as
SELECT * FROM dataplatform_near_social_feed.comments p
WHERE NOT EXISTS (
    SELECT * FROM dataplatform_near_moderation.moderation_decisions d
    WHERE p.account_id = d.moderated_account_id
      AND (d.moderated_path IS NULL OR (d.moderated_path = '/post/comment' AND d.moderated_blockheight = p.block_height))
);
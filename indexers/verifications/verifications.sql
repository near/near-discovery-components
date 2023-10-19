CREATE TABLE
    "account" (
                  "account_id" TEXT NOT NULL,
                  "human_valid_until" timestamp NULL,
                  "human_verification_level" text NULL,
                  "human_provider" text NULL,
                  "kyc_valid_until" timestamp NULL,
                  "kyc_verification_level" text NULL,
                  "kyc_provider" text NULL,
                  "social_trust_score_1" integer NULL,
                  "social_trust_provider_1" text NULL,
                  "social_trust_score_2" integer NULL,
                  "social_trust_provider_2" text NULL,
                  PRIMARY KEY ("account_id")
)

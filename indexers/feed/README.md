# Feed indexer
This indexer holds the top level views used to display the feed.
It prevents a circular reference between the social_feed and moderation indexers.

The relationships.json file documents the manually created GraphQL relationships used by the feed, in hasura metadata format. 
At some point QueryApi indexers may support a similar format for declarative relationships.
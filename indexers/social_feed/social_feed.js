import { Block } from "@near-lake/primitives";
/**
 * Note: We only support javascript at the moment. We will support Rust, Typescript in a further release.
 */

/**
 * getBlock(block, context) applies your custom logic to a Block on Near and commits the data to a database.
 * context is a global variable that contains helper methods.
 * context.db is a subfield which contains helper methods to interact with your database.
 *
 * Learn more about indexers here:  https://docs.near.org/concepts/advanced/indexers
 *
 * @param {block} Block - A Near Protocol Block
 */
async function getBlock(block: Block) {
  function base64decode(encodedValue) {
    let buff = Buffer.from(encodedValue, "base64");
    return JSON.parse(buff.toString("utf-8"));
  }

  async function handlePostCreation(
    accountId,
    blockHeight,
    blockTimestamp,
    receiptId,
    content,
  ) {
    try {
      const mutationData = {
        post: {
          account_id: accountId,
          block_height: blockHeight,
          block_timestamp: blockTimestamp,
          content: content,
          receipt_id: receiptId,
        },
      };

      // Call GraphQL mutation to insert a new post
      await context.graphql(
        `mutation createPost($post: dataplatform_near_social_feed_posts_insert_input!){
                    insert_dataplatform_near_social_feed_posts_one(
                        object: $post
                    ) {
                        account_id
                        block_height
                    }
                }`,
        mutationData,
      );

      console.log(`Post by ${accountId} has been added to the database`);
    } catch (e) {
      console.log(
        `Failed to store post by ${accountId} to the database (perhaps it already stored)`,
      );
    }
  }

  async function handleCommentCreation(
    accountId,
    blockHeight,
    blockTimestamp,
    receiptId,
    commentString,
  ) {
    const comment = JSON.parse(commentString);
    const postAuthor = comment.item.path.split("/")[0];
    const postBlockHeight = comment.item.blockHeight;

    // find post to retrieve Id or print a warning that we don't have it
    try {
      // Call GraphQL query to fetch posts that match specified criteria
      const posts = await context.graphql(
        `query getPosts($accountId: String = "$accountId", $blockHeight: numeric = "$blockHeight"){
                    dataplatform_near_social_feed_posts(
                        where: {
                            account_id: {_eq: $accountId},
                            block_height: {_eq: $blockHeight}
                        },
                        limit: 1
                    ) {
                        account_id
                        accounts_liked
                        block_height
                        block_timestamp
                        content
                        id
                    }
                }`,
        {
          accountId: postAuthor,
          blockHeight: postBlockHeight,
        },
      );
      console.log(`posts: ${JSON.stringify(posts)}`);
      if (posts.dataplatform_near_social_feed_posts.length === 0) {
        return;
      }

      const post = posts.dataplatform_near_social_feed_posts[0];

      try {
        delete comment["item"];
        const mutationData = {
          comment: {
            account_id: accountId,
            receipt_id: receiptId,
            block_height: blockHeight,
            block_timestamp: blockTimestamp,
            content: JSON.stringify(comment),
            post_id: post.id,
          },
        };
        // Call GraphQL mutation to insert a new comment
        await context.graphql(
          `mutation createComment($comment: dataplatform_near_social_feed_comments_insert_input!){
                        insert_dataplatform_near_social_feed_comments_one(
                            object: $comment
                        ) {
                            account_id
                            receipt_id
                            block_height
                            block_timestamp
                            content
                            post_id
                        }
                    }`,
          mutationData,
        );

        // Update last comment timestamp in Post table
        const currentTimestamp = Date.now();
        await context.graphql(
          `mutation SetLastCommentUpdated {
                        update_dataplatform_near_social_feed_posts(
                            where: {id: {_eq: ${post.id}}}
                            _set: {last_comment_timestamp: ${currentTimestamp}}
                        )
                        {
                            returning {
                                id
                            }
                        }
                    }
                    `,
          {},
        );
        console.log(`Comment by ${accountId} has been added to the database`);
      } catch (e) {
        console.log(
          `Failed to store comment to the post ${postAuthor}/${postBlockHeight} by ${accountId} perhaps it has already been stored. Error ${e}`,
        );
      }
    } catch (e) {
      console.log(
        `Failed to store comment to the post ${postAuthor}/${postBlockHeight} as we don't have the post stored.`,
      );
    }
  }

  async function handleLike(
    accountId,
    blockHeight,
    blockTimestamp,
    receiptId,
    likeContent,
  ) {
    try {
      const like = JSON.parse(likeContent);
      const likeAction = like.value.type; // like or unlike
      const [itemAuthor, _, itemType] = like.key.path.split("/", 3);
      const itemBlockHeight = like.key.blockHeight;
      console.log("handling like", receiptId, accountId);
      switch (itemType) {
        case "main":
          try {
            const posts = await context.graphql(
              `query getPosts($accountId: String = "$accountId", $blockHeight: numeric = "$blockHeight"){
                                dataplatform_near_social_feed_posts(
                                    where: {
                                        account_id: {_eq: $accountId},
                                        block_height: {_eq: $blockHeight}
                                    },
                                    limit: 1
                                ) {
                                    account_id
                                    accounts_liked
                                    block_height
                                    block_timestamp
                                    content
                                    id
                                }
                            }`,
              {
                accountId: itemAuthor,
                blockHeight: itemBlockHeight,
              },
            );
            if (posts.dataplatform_near_social_feed_posts.length == 0) {
              return;
            }

            const post = posts.dataplatform_near_social_feed_posts[0];
            switch (likeAction) {
              case "like":
                await _handlePostLike(
                  post.id,
                  accountId,
                  blockHeight,
                  blockTimestamp,
                  receiptId,
                );
                break;
              case "unlike":
              default:
                await _handlePostUnlike(post.id, accountId);
                break;
            }
          } catch (e) {
            console.log(
              `Failed to store like to post ${itemAuthor}/${itemBlockHeight} as we don't have it stored in the first place.`,
            );
          }
          break;
        case "comment":
          // Comment
          console.log(`Likes to comments are not supported yet. Skipping`);
          break;
        default:
          // something else
          console.log(`Got unsupported like type "${itemType}". Skipping...`);
          break;
      }
    } catch (likeError) {
      console.log("Error in handleLike", likeError);
    }
  }

  async function _handlePostLike(
    postId,
    likeAuthorAccountId,
    likeBlockHeight,
    blockTimestamp,
    receiptId,
  ) {
    try {
      const posts = await context.graphql(
        `query getPosts($postId: Int!) {
                    dataplatform_near_social_feed_posts(where: { id: { _eq: $postId } }) {
                        id
                        account_id
                        block_height
                        block_timestamp
                        content
                        accounts_liked
                    }
                }`,
        { postId: postId },
      );
      if (posts.dataplatform_near_social_feed_posts.length == 0) {
        return;
      }
      const post = posts.dataplatform_near_social_feed_posts[0];
      let accountsLiked =
        post.accounts_liked.length === 0
          ? post.accounts_liked
          : JSON.parse(post.accounts_liked);

      if (accountsLiked.indexOf(likeAuthorAccountId) === -1) {
        accountsLiked.push(likeAuthorAccountId);
      }

      // Call GraphQL mutation to update a post's liked accounts list
      await context.graphql(
        `mutation updatePost($postId: Int!, $likedAccount: jsonb){
                    update_dataplatform_near_social_feed_posts(
                        where: {id: {_eq: $postId}}
                        _set: {accounts_liked: $likedAccount}
                    ) {
                        returning {
                            id
                        }
                    }
                }`,
        {
          postId: postId,
          likedAccount: JSON.stringify(accountsLiked),
        },
      );

      const postLikeMutation = {
        postLike: {
          post_id: postId,
          account_id: likeAuthorAccountId,
          block_height: likeBlockHeight,
          block_timestamp: blockTimestamp,
          receipt_id: receiptId,
        },
      };
      // Call GraphQL mutation to insert a new like for a post
      await context.graphql(
        `
                    mutation InsertLike($postLike: dataplatform_near_social_feed_post_likes_insert_input!) {
                        insert_dataplatform_near_social_feed_post_likes_one(object: $postLike) {
                            post_id
                        }
                    }
                `,
        postLikeMutation,
      );
    } catch (e) {
      console.log(`Failed to store like to in the database: ${e}`);
    }
  }

  async function _handlePostUnlike(postId, likeAuthorAccountId) {
    try {
      const posts = await context.graphql(
        `query getPosts($postId: Int!) {
                    dataplatform_near_social_feed_posts(where: { id: { _eq: $postId } }) {
                        id
                        account_id
                        block_height
                        block_timestamp
                        content
                        accounts_liked
                    }
                }`,
        { postId: postId },
      );
      if (posts.dataplatform_near_social_feed_posts.length == 0) {
        return;
      }
      const post = posts.dataplatform_near_social_feed_posts[0];
      let accountsLiked =
        post.accounts_liked.length === 0
          ? post.accounts_liked
          : JSON.parse(post.accounts_liked);

      console.log(accountsLiked);

      let indexOfLikeAuthorAccountIdInPost =
        accountsLiked.indexOf(likeAuthorAccountId);
      if (indexOfLikeAuthorAccountIdInPost > -1) {
        accountsLiked.splice(indexOfLikeAuthorAccountIdInPost, 1);
        // Call GraphQL mutation to update a post's liked accounts list
        await context.graphql(
          `mutation updatePost($postId: Int!, $likedAccount: jsonb){
                        update_dataplatform_near_social_feed_posts(
                            where: {id: {_eq: $postId}}
                            _set: {accounts_liked: $likedAccount}
                        ) {
                            returning {
                                id
                            }
                        }
                    }`,
          {
            postId: postId,
            likedAccount: JSON.stringify(accountsLiked),
          },
        );
      }
      // Call GraphQL mutation to delete a like for a post
      await context.graphql(
        `mutation deletePostLike($accountId: String!, $postId: Int!){
                    delete_dataplatform_near_social_feed_post_likes(
                        where: {
                            _and: [
                                {account_id: {_eq: $accountId}},
                                {post_id: {_eq: $postId}}
                            ]
                        }
                    ) {
                        returning {
                            post_id
                            account_id
                        }
                    }
                }`,
        {
          accountId: likeAuthorAccountId,
          postId: postId,
        },
      );
    } catch (e) {
      console.log(`Failed to delete like from the database: ${e}`);
    }
  }

  // Add your code here
  const SOCIAL_DB = "social.near";

  const nearSocialPosts = block
    .actions()
    .filter((action) => action.receiverId === SOCIAL_DB)
    .flatMap((action) =>
      action.operations
        .map((operation) => operation["FunctionCall"])
        .filter((operation) => operation?.methodName === "set")
        .map((functionCallOperation) => ({
          ...functionCallOperation,
          args: base64decode(functionCallOperation.args),
          receiptId: action.receiptId, // providing receiptId as we need it
        }))
        .filter((functionCall) => {
          const accountId = Object.keys(functionCall.args.data)[0];
          return (
            Object.keys(functionCall.args.data[accountId]).includes("post") ||
            Object.keys(functionCall.args.data[accountId]).includes("index")
          );
        }),
    );

  if (nearSocialPosts.length > 0) {
    console.log("Found Near Social Posts in Block...");
    const blockHeight = block.blockHeight;
    const blockTimestamp = block.header().timestampNanosec;
    await Promise.all(
      nearSocialPosts.map(async (postAction) => {
        const accountId = Object.keys(postAction.args.data)[0];
        console.log(`ACCOUNT_ID: ${accountId}`);

        // if creates a post
        if (
          postAction.args.data[accountId].post &&
          Object.keys(postAction.args.data[accountId].post).includes("main")
        ) {
          console.log("Creating a post...");
          await handlePostCreation(
            accountId,
            blockHeight,
            blockTimestamp,
            postAction.receiptId,
            postAction.args.data[accountId].post.main,
          );
        } else if (
          postAction.args.data[accountId].post &&
          Object.keys(postAction.args.data[accountId].post).includes("comment")
        ) {
          // if creates a comment
          await handleCommentCreation(
            accountId,
            blockHeight,
            blockTimestamp,
            postAction.receiptId,
            postAction.args.data[accountId].post.comment,
          );
        } else if (
          Object.keys(postAction.args.data[accountId]).includes("index")
        ) {
          // Probably like or unlike action is happening
          if (
            Object.keys(postAction.args.data[accountId].index).includes("like")
          ) {
            console.log("handling like");
            await handleLike(
              accountId,
              blockHeight,
              blockTimestamp,
              postAction.receiptId,
              postAction.args.data[accountId].index.like,
            );
          }
        }
      }),
    );
  }
}

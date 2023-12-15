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
    groupId,
    blockHeight,
    blockTimestamp,
    receiptId,
    content
  ) {
    try {
      const postData = {
        account_id: accountId,
        group_id: groupId,
        block_height: blockHeight,
        block_timestamp: blockTimestamp,
        content: content,
        receipt_id: receiptId,
        accounts_liked: 0,
      };
      //TODO check group membership

      // Call GraphQL mutation to insert a new post
      await context.db.Posts.insert(postData);

      console.log(`Post by ${accountId} has been added to the database`);
    } catch (e) {
      console.log(
        `Failed to store post by ${accountId} to the database (perhaps it is already stored)`
      );
    }
  }

  async function handleCommentCreation(
    accountId,
    blockHeight,
    blockTimestamp,
    receiptId,
    commentString
  ) {
    try {
      const comment = JSON.parse(commentString);
      const postAuthor = comment.item.path.split("/")[0];
      const postBlockHeight = comment.item.blockHeight;

      // find post to retrieve Id or print a warning that we don't have it
      try {
        // Call GraphQL query to fetch posts that match specified criteria
        const posts = await context.db.Posts.select(
          { account_id: postAuthor, block_height: postBlockHeight },
          1
        );
        console.log(`posts: ${JSON.stringify(posts)}`);
        if (posts.length === 0) {
          return;
        }

        const post = posts[0];

        try {
          delete comment["item"];
          const commentData = {
            account_id: accountId,
            receipt_id: receiptId,
            block_height: blockHeight,
            block_timestamp: blockTimestamp,
            content: JSON.stringify(comment),
            post_id: post.id,
          };
          // Call GraphQL mutation to insert a new comment
          await context.db.Comments.insert(commentData);

          // Update last comment timestamp in Post table
          const currentTimestamp = Date.now();
          await context.db.Posts.update(
            { id: post.id },
            { last_comment_timestamp: currentTimestamp }
          );
          console.log(`Comment by ${accountId} has been added to the database`);
        } catch (e) {
          console.log(
            `Failed to store comment to the post ${postAuthor}/${postBlockHeight} by ${accountId} perhaps it has already been stored. Error ${e}`
          );
        }
      } catch (e) {
        console.log(
          `Failed to store comment to the post ${postAuthor}/${postBlockHeight} as we don't have the post stored.`
        );
      }
    } catch (error) {
      console.log("Failed to parse comment content. Skipping...", error);
    }
  }

  async function handleLike(
    accountId,
    blockHeight,
    blockTimestamp,
    receiptId,
    likeContent
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
            const posts = await context.db.Posts.select(
              { account_id: itemAuthor, block_height: itemBlockHeight },
              1
            );
            if (posts.length == 0) {
              return;
            }

            const post = posts[0];
            switch (likeAction) {
              case "like":
                await _handlePostLike(
                  post.id,
                  accountId,
                  blockHeight,
                  blockTimestamp,
                  receiptId
                );
                break;
              case "unlike":
                await _handlePostUnlike(post.id, accountId);
                break;
            }
          } catch (e) {
            console.log(
              `Failed to store like to post ${itemAuthor}/${itemBlockHeight} as we don't have it stored in the first place.`
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
    } catch (error) {
      console.log("Failed to parse like content. Skipping...", error);
    }
  }

  async function _handlePostLike(
    postId,
    likeAuthorAccountId,
    likeBlockHeight,
    blockTimestamp,
    receiptId
  ) {
    try {
      const posts = await context.db.Posts.select({ id: postId });
      if (posts.length == 0) {
        return;
      }
      const post = posts[0];
      let accountsLiked =
        post.accounts_liked.length === 0
          ? post.accounts_liked
          : JSON.parse(post.accounts_liked);

      if (accountsLiked.indexOf(likeAuthorAccountId) === -1) {
        accountsLiked.push(likeAuthorAccountId);
      }

      // Call GraphQL mutation to update a post's liked accounts list
      await context.db.Posts.update(
        { id: postId },
        { accounts_liked: JSON.stringify(accountsLiked) }
      );

      const postLikeData = {
        post_id: postId,
        account_id: likeAuthorAccountId,
        block_height: likeBlockHeight,
        block_timestamp: blockTimestamp,
        receipt_id: receiptId,
      };
      // Call GraphQL mutation to insert a new like for a post
      await context.db.PostLikes.insert(postLikeData);
    } catch (e) {
      console.log(`Failed to store like to in the database: ${e}`);
    }
  }

  async function _handlePostUnlike(postId, likeAuthorAccountId) {
    try {
      const posts = await context.db.Posts.select({ id: postId });
      if (posts.length == 0) {
        return;
      }
      const post = posts[0];
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
        await context.db.Posts.update(
          { id: postId },
          { accounts_liked: JSON.stringify(accountsLiked) }
        );
      }
      // Call GraphQL mutation to delete a like for a post
      await context.db.PostLikes.delete({
        account_id: likeAuthorAccountId,
        post_id: postId,
      });
    } catch (e) {
      console.log(`Failed to delete like from the database: ${e}`);
    }
  }

  // Add your code here
  const SOCIAL_DB = "social.near";

  let nearSocialPosts = [];
  let receipts = [];
  try {
    const actions = block.actions();
    receipts = block.receipts();
    if (!actions && !receipts) {
      console.log("Block has no actions and no receipts");
      return;
    }
    const contractActions = actions.filter(
      (action) => action.receiverId === SOCIAL_DB
    );
    if (!contractActions) {
      console.log("Block has no actions");
    } else {
      nearSocialPosts = contractActions.flatMap((action) =>
        action.operations
          .map((operation) => operation["FunctionCall"])
          .filter((operation) => operation?.methodName === "set")
          .map((functionCallOperation) => {
            try {
              return {
                ...functionCallOperation,
                args: base64decode(functionCallOperation.args),
                receiptId: action.receiptId, // providing receiptId as we need it
              };
            } catch (e) {
              console.log("Error parsing function call", e);
            }
          })
          .filter((functionCall) => {
            try {
              if (
                !functionCall ||
                !functionCall.args ||
                !functionCall.args.data ||
                !Object.keys(functionCall.args.data) ||
                !Object.keys(functionCall.args.data)[0]
              ) {
                console.log(
                  "Set operation did not have arg data in expected format"
                );
                return;
              }
              const accountId = Object.keys(functionCall.args.data)[0];
              return (
                Object.keys(functionCall.args.data[accountId]).includes(
                  "post"
                ) ||
                Object.keys(functionCall.args.data[accountId]).includes("index")
              );
            } catch (e) {
              console.log("Error parsing social args", functionCall);
            }
          })
      );
    }
  } catch (e) {
    console.log("Error parsing social operations", block.actions());
  }

  // Finding NFT events
  if (receipts.length > 0) {
    for (let r of block.receipts()) {
      if (!r.events.length) continue;

      for (let log of r.logs) {
        if (!log.match(/^EVENT_JSON:(.*)$/)) continue;

        try {
          let event = JSON.parse(log.substring(log.indexOf(":") + 1));

          if (event.standard === "nep171") {
            if (event.event === "nft_mint") {
              for (let elem of event.data) {
                const groupMemberData = {
                  contract_id: r.receiverId,
                  block_height: height,
                  block_timestamp: createdOn,
                  receipt_id: r.receiptId,
                  member_id: elem.owner_id,
                  nft_data: JSON.stringify(elem),
                  is_burnt: false,
                  is_transferred: false,
                };

                await context.db.Groups.insert(groupMemberData);

                console.log(
                  `Member ${elem.owner_id} of a group ${r.receiverId} has been stored successfully, block height: ${height}, receiptId: ${r.receiptId}.`
                );
              }
            } else if (event.event === "nft_transfer") {
                // TODO
            } else if (event.event === "nft_burn") {
                // TODO
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
  }

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
          const groupId = JSON.parse(
            postAction.args.data[accountId].post.main
          ).groupId;
          if (groupId) {
            console.log("Creating a post...");
            await handlePostCreation(
              accountId,
              groupId,
              blockHeight,
              blockTimestamp,
              postAction.receiptId,
              postAction.args.data[accountId].post.main
            );
          }
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
            postAction.args.data[accountId].post.comment
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
              postAction.args.data[accountId].index.like
            );
          }
        }
      })
    );
  }
}

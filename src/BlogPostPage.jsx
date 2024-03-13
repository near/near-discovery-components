const GRAPHQL_ENDPOINT = props.GRAPHQL_ENDPOINT || "https://near-queryapi.api.pagoda.co";
const BlogPostWrapper = styled.div`
  @media (max-width: 1024px) {
    padding-left: 0;
  }

  h1 {
    font: var(--text-3xl);
    color: var(--sand12);
    margin: 0 0 3rem;
    font-weight: 700;

    @media (max-width: 1024px) {
      padding-left: 0;
    }

    @media (max-width: 800px) {
      font: var(--text-3xl);
      font-weight: 600;
      margin: 0 0 2rem;
    }
  }

  h2 {
    font: var(--text-2xl);
    color: var(--sand12);
    margin: 0 0 1.5rem;
    font-weight: 600;
  }

  h3 {
    font: var(--text-m);
    color: var(--sand12);
    margin: 0 0 1.5rem;
    font-weight: 500;
  }

  p {
    font: var(--text-base);
    font-weight: 500;
    color: var(--sand12);
    margin: 0;
  }
`;

const BlogPostContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  margin-bottom: 3rem;

  @media (max-width: 1024px) {
    padding: 0 1rem;
  }

  ol,
  ul {
    text-align: left;
    padding-left: 1.5rem;
    margin: 0;
  }
`;

const BlogPostActionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  text-align: left;
  margin: 0 auto;
  width: 100%;
  max-width: 800px;
  margin-left: auto;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

const PostDate = styled.div`
  margin-top: -2rem;
  margin-bottom: 1.5rem;
  color: #706f6c;
`;

const ItemWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const PostImage = styled.img`
  width: 100%;
  height: 0;
  padding-bottom: 50%;
  background-image: url(${(props) => props.imageUrl});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  display: block;
  margin-bottom: 2rem;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: -6px -6px 6px;
`;

const Comments = styled.div`
  margin-top: 2em;
  > div > div:first-child {
    padding-top: 12px;
  }
`;

const CommentWrapper = styled.div`
  > div:first-child {
    > a:first-child {
      display: inline-flex;
      margin-bottom: 24px;
      font-size: 14px;
      line-height: 20px;
      color: #687076;
      outline: none;
      font-weight: 600;

      &:hover,
      &:focus {
        color: #687076;
        text-decoration: underline;
      }
    }
  }
`;

if (!props.accountId || !(props.blockHeight || props.commentBlockHeight)) {
  return (
    <div className="alert alert-danger mx-3" role="alert">
      Invalid link, one or more parameters are missing.
    </div>
  );
}

const [blog, setBlog] = useState(null);
const [showReply, setShowReply] = useState(false);
const notifyAccountId = props.notifyAccountId;
const item = {
  type: "social",
  path: `${accountId}/post/main`,
  blockHeight,
};

const blogPostQuery = `
query IndexerQuery {
  dataplatform_near_feed_moderated_posts(
    order_by: {block_height: desc}
    where: {_and: {block_height: {_eq: ${props.blockHeight}}, account_id: {_eq: "${props.accountId}"}}}
  ) {
    account_id
    block_height
    block_timestamp
    content
    receipt_id
    accounts_liked
    comments(order_by: {block_height: asc}) {
      account_id
      block_height
      block_timestamp
      content
    }
  }
}
`;

function fetchGraphQL(operationsDoc, operationName, variables) {
  return asyncFetch(`${GRAPHQL_ENDPOINT}/v1/graphql`, {
    method: "POST",
    headers: { "x-hasura-role": "dataplatform_near" },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });
}

fetchGraphQL(blogPostQuery, "IndexerQuery", {}).then((result) => {
  if (result.status === 200) {
    if (result.body.data) {
      const posts = result.body.data.dataplatform_near_feed_moderated_posts;
      if (posts.length > 0) {
        const blogPost = posts[0];
        let content = JSON.parse(blogPost.content);

        if (blogPost.accounts_liked.length !== 0) {
          if (typeof blogPost.accounts_liked === "string") {
            blogPost.accounts_liked = JSON.parse(blogPost.accounts_liked);
          }
        }
        const comments = blogPost.comments;
        setBlog({
          block_height: blogPost.block_height,
          block_timestamp: blogPost.block_timestamp,
          blogContent: content.text,
          blogComments: comments,
          blogLikes: blogPost.accounts_liked,
          accountId: blogPost.account_id,
        });
      } else {
        setBlog("not found");
      }
    }
  }
});

if (blog === "not found") {
  return (
    <div className="alert alert-danger mx-3" role="alert">
      Blog not found. 🤔
    </div>
  );
}

function parseMarkdown(markdown) {
  const parsedMarkdown = [];
  const lines = markdown.split("\n");

  let currentHeader = null;
  let listType = null;

  lines.forEach((line, index) => {
    line = line.trim();
    if (index === 0 && isImage(line)) {
      parsedMarkdown.push({ type: "header-image", imageUrl: getImageUrl(line) });
    } else if (line.startsWith("#")) {
      listType = null;
      const level = line.match(/^#+/)[0].length;
      const text = line.replace(/^#+\s*/, "");
      currentHeader = { type: "header", level, text };
      parsedMarkdown.push(currentHeader);
    } else if (line.startsWith("* ") || line.startsWith("- ") || /^\d+\./.test(line)) {
      if (listType !== "unordered" && listType !== "ordered") {
        listType = line.startsWith("* ") || line.startsWith("- ") ? "unordered" : "ordered";
        parsedMarkdown.push({ type: "list-start", listType });
      }
      parsedMarkdown.push({ type: "list-item", content: line });
    } else {
      if (currentHeader) {
        currentHeader = null;
      }
      if (line.trim().length > 0) {
        parsedMarkdown.push({ type: "paragraph", content: line });
        listType = null;
      }
    }
  });

  return parsedMarkdown;
}
function isImage(line) {
  return line.trim().startsWith("![");
}

function getImageUrl(line) {
  const match = line.match(/\((.*?)\)/);
  if (match) {
    return match[1].replace(/'/g, "");
  }
  return null;
}

function getFirstHeading(markdownArray) {
  for (const element of markdownArray) {
    if (element.type === "header") {
      return element;
    }
  }
  return null;
}

const getPostTime = (blockHeight) => {
  const block = Near.block(blockHeight);

  if (block === null) {
    return "Loading";
  }

  if (!block) {
    return "unknown";
  }

  const timeMs = parseFloat(block.header.timestamp_nanosec) / 1e6;
  const date = new Date(timeMs);
  const mdy = `${date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;

  return {
    timeMs,
    date,
    mdy,
  };
};

if (blog) {
  const postUrl = `https://near.org/near/widget/BlogPostPage?accountId=${props.accountId}&blockHeight=${props.blockHeight}`;
  const markdownObj = parseMarkdown(blog.blogContent);

  const renderComment = (a) => {
    return (
      <div key={JSON.stringify(a)}>
        <Widget
          src={`${REPL_ACCOUNT}/widget/Comments.Comment`}
          props={{
            accountId: a.account_id,
            blockHeight: a.block_height,
            content: a.content,
            highlight:
              a.account_id === props.highlightComment?.accountId &&
              a.block_height === props.highlightComment?.blockHeight,
            GRAPHQL_ENDPOINT,
            notifyAccountId,
            item,
          }}
        />
      </div>
    );
  };

  const renderedComments = blog.blogComments?.map(renderComment);

  const addNewCommentFn = (newComment) => {
    setBlog(
      Object.assign({}, blog, {
        blogComments: [...blog.blogComments, newComment],
      }),
    );
  };

  const commentButtonHandler = () => {
    if (!context.accountId) {
      props.requestAuthentication();
    } else {
      setShowReply(!showReply);
    }
  };

  return (
    <>
      <BlogPostWrapper>
        <Widget
          src="${REPL_ACCOUNT}/widget/DIG.Button"
          props={{
            label: "Back To All Posts",
            href: `/bosblog`,
            iconLeft: "ph ph-arrow-left",
            variant: "secondary",
            size: "small",
          }}
          style={{ marginBottom: "1rem" }}
        />
        {/* RENDER BLOG HEADER IMAGE */}
        <PostImage
          imageUrl={
            markdownObj[0].imageUrl ||
            "https://ipfs.near.social/ipfs/bafkreiatutmf7b7siy2ul7ofo7cmypwc3qlgwseoij3gdxuqf7xzcdguia"
          }
          alt="Post image"
        />
        <BlogPostContentWrapper>
          <TitleSection>
            {/* RENDER BLOG HEADER - TITLE   */}

            <h1>{getFirstHeading(markdownObj)?.text || "Untitled"}</h1>

            {/* RENDER BLOG HEADER - DATE */}

            <PostDate>{getPostTime(blog.block_height).mdy}</PostDate>

            {/* RENDER BLOG HEADER - AUTHOR INFO */}

            <Widget
              src="${REPL_ACCOUNT}/widget/AccountProfile"
              key={blog.accountId}
              props={{
                accountId: blog.accountId,
              }}
            />
          </TitleSection>

          {/* RENDER BLOG BODY */}
          {markdownObj.map((element, index) => {
            if ((index <= 1 && element.type === "header") || element.type === "header-image") {
              return;
            } else {
              return (
                <ItemWrapper style={{ marginTop: element.type === "list-item" ? "" : "2em" }}>
                  <Widget src="${REPL_ACCOUNT}/widget/SocialMarkdown" props={{ text: element.content }} />
                </ItemWrapper>
              );
            }
          })}
        </BlogPostContentWrapper>

        {/* RENDER BLOG FOOTER - COMMENTS / LIKES / ETC */}
        <BlogPostActionsWrapper>
          {blockHeight !== "now" && (
            <Actions>
              <Widget
                src="${REPL_ACCOUNT}/widget/v1.LikeButton"
                props={{
                  item,
                  notifyAccountId,
                  likes: blog.blogLikes,
                  requestAuthentication: props.requestAuthentication,
                }}
              />

              <Widget
                src="${REPL_ACCOUNT}/widget/CommentButton"
                props={{
                  item,
                  onClick: () => commentButtonHandler(),
                }}
              />

              <Widget
                src="${REPL_ACCOUNT}/widget/CopyUrlButton"
                props={{
                  url: postUrl,
                }}
              />
              <Widget
                src="${REPL_ACCOUNT}/widget/ShareButton"
                props={{
                  postType: "post",
                  url: postUrl,
                }}
              />
            </Actions>
          )}
          {showReply && (
            <div className="mb-2">
              <Widget
                src="${REPL_ACCOUNT}/widget/Comments.Compose"
                props={{
                  notifyAccountId,
                  item,
                  onComment: () => setShowReply(false),
                  newAddedComment: addNewCommentFn,
                }}
              />
            </div>
          )}
          {renderedComments && (
            <Comments>
              <CommentWrapper>{renderedComments}</CommentWrapper>
            </Comments>
          )}
        </BlogPostActionsWrapper>
      </BlogPostWrapper>
      <Widget src="${REPL_ACCOUNT}/widget/NearOrg.Footer" />
    </>
  );
}

if (!blogPost) {
  return <div>Loading...</div>;
}

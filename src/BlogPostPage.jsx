const GRAPHQL_ENDPOINT = props.GRAPHQL_ENDPOINT || "https://near-queryapi.api.pagoda.co";

const BlogPostWrapper = styled.div`
  @media (max-width: 1024px) {
    padding-left: 0;
  }

  h1 {
    font: var(--text-hero);
    color: var(--sand12);
    margin: 0 0 3rem;

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
    font: var(--text-l);
    color: var(--sand12);
    margin: 0 0 1.5rem;
    font-weight: 600;
  }

  h3 {
    font: var(--text-m);
    color: var(--sand12);
    margin: 0 0 1.5rem;
    font-weight: 400;
  }

  p {
    font: var(--text-base);
    font-weight: 400;
    color: var(--sand12);
    margin: 0;
  }
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: 2rem;
`;

const PostImage = styled.img`
  width: 100%; /* Full width of the container */
  height: 0; /* Initial height, will be overridden by padding */
  padding-bottom: 50%; /* Aspect ratio: height is 50% of the width, resulting in 2:1 */
  background-image: url(${(props) => props.imageUrl});
  background-size: cover;
  background-position: center;
  border-radius: 8px; /* Optional, for rounded corners */
  display: block;
`;

if (!props.accountId || !(props.blockHeight || props.commentBlockHeight)) {
  return (
    <div className="alert alert-danger mx-3" role="alert">
      Invalid link, one or more parameters are missing.
    </div>
  );
}

const [blog, setBlog] = useState(null);

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

  lines.forEach((line, index) => {
    line = line.trim();
    if (index === 0 && isImage(line)) {
      parsedMarkdown.push({ type: "header-image", imageUrl: getImageUrl(line) });
    } else if (line.startsWith("#")) {
      const level = line.match(/^#+/)[0].length;
      const text = line.replace(/^#+\s*/, "");
      currentHeader = { type: "header", level, text };
      parsedMarkdown.push(currentHeader);
    } else {
      if (currentHeader) {
        currentHeader = null; // Reset currentHeader after encountering a non-header line
      }
      if (line.trim().length > 0) {
        parsedMarkdown.push({ type: "paragraph", content: line });
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
    return match[1].replace(/'/g, ""); // remove single quotes if present
  }
  return null;
}

function getFirstHeading(markdownArray) {
  for (const element of markdownArray) {
    if (element.type === "header") {
      return element;
    }
  }
  return null; // Return null if no heading is found
}

if (blog) {
  const renderPost = (post) => {
    return <Widget src="${REPL_ACCOUNT}/widget/Posts.Post" props={{ ...post }} />;
  };
  const renderData = (dataProps) => {
    return <Widget src="${REPL_ACCOUNT}/widget/Posts.ModeratedPostData" props={{ ...dataProps, renderPost }} />;
  };

  // console.log('blog.blogContent',blog.blogContent)
  const markdownObj = parseMarkdown(blog.blogContent);
  console.log("markdownObj", markdownObj);
  console.log("blog", blog);

  return (
    <BlogPostWrapper className="container-xl">
      <TitleSection>
        <Widget
          src="${REPL_ACCOUNT}/widget/DIG.Button"
          props={{
            label: "Back To All Posts",
            href: `/${REPL_ACCOUNT}/widget/Blog.Feed`,
            iconLeft: "ph ph-arrow-left",
            variant: "secondary",
            size: "small",
          }}
        />

        {/* RENDER BLOG HEADER IMAGE */}
        <PostImage
          imageUrl={
            markdownObj[0].imageUrl || "https://pages.near.org/wp-content/uploads/2023/06/generic-green-blog.png"
          }
          alt="Post image"
        />

        {/* RENDER BLOG HEADER - TITLE   */}

        <h1 style={{ align: "left" }}>{getFirstHeading(markdownObj)?.text || "Untitled"}</h1>

        {/* RENDER BLOG HEADER - DATE */}

        <p>
          <Widget
            src="${REPL_ACCOUNT}/widget/TimeAgo"
            props={{ blockHeight: blog.block_height, blockTimestamp: blog.block_timestamp }}
          />
        </p>

        {/* RENDER BLOG HEADER - AUTHOR INFO */}

        <Widget
          src="${REPL_ACCOUNT}/widget/AccountProfileInline"
          key={blog.accountId}
          props={{
            accountId: blog.accountId,
          }}
        />
      </TitleSection>

      {/* <div className="row">
            <div className="col-auto">
              <Widget
                src="${REPL_ACCOUNT}/widget/AccountProfile"
                props={{
                  profile,
                  verifications,
                  accountId,
                  hideAccountId: true,
                  inlineContent: (
                    <>
                      <Text as="span">･</Text>
                      <Text>
                        <Widget src="${REPL_ACCOUNT}/widget/TimeAgo" props={{ blockHeight, blockTimestamp }} />
                      </Text>
                      {false && edits.length > 0 && <Text as="span">･ Edited</Text>}
                    </>
                  ),
                  showFlagAccountFeature,
                }}
              />
            </div>
          </div> */}

      {/* RENDER BLOG BODY */}
      <Widget src="${REPL_ACCOUNT}/widget/SocialMarkdown" props={{ text: blog.blogContent }} />

      <Markdown text={props.text} onMention={renderMention} />

      {/* RENDER BLOG FOOTER - COMMENTS / LIKES / ETC */}
      {/* <Widget src="${REPL_ACCOUNT}/widget/Moderation.CheckPostModeration" props={{ ...props, renderData }} />; */}
    </BlogPostWrapper>
  );
}

if (!blogPost) {
  return <div>Loading...</div>;
}

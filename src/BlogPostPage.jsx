const GRAPHQL_ENDPOINT = props.GRAPHQL_ENDPOINT || "https://near-queryapi.api.pagoda.co";

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
          blogContent: content.text,
          blogComments: comments,
          blogLikes: blogPost.accounts_liked,
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

if (blog) {
  return (
    <>
      <Link href={`/${REPL_ACCOUNT}/widget/Blog.Feed`} style={{ color: "black" }}>
        <i className="bi bi-arrow-left"></i>
        {` back`}
      </Link>
      <Widget src="${REPL_ACCOUNT}/widget/SocialMarkdown" props={{ text: blog.blogContent }} />
    </>
  );
}

if (!blogPost) {
  return <div>Loading...</div>;
}

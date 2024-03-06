const GRAPHQL_ENDPOINT = props.GRAPHQL_ENDPOINT || "https://near-queryapi.api.pagoda.co";

//place id of the post you want to fetch from the dataplatform_near_social_feed_moderated_posts table
const blogPostIds = props.blogPostIds || [75675];

const [posts, setPosts] = useState([]);

const blogPostsQuery = `
query FeedQuery {
  dataplatform_near_feed_moderated_posts(
    order_by: {block_height: desc}
    where: {
      _and: {
        id: {_in: ${blogPostIds}}
      }
    }
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

fetchGraphQL(blogPostsQuery, "FeedQuery", {}).then((result) => {
  if (result.status === 200) {
    if (result.body.data) {
      const posts = result.body.data.dataplatform_near_feed_moderated_posts;
      setPosts(posts);
      if (posts.length > 0) {
        const post = posts[0];
        let content = JSON.parse(post.content);
        if (post.accounts_liked.length !== 0) {
          if (typeof post.accounts_liked === "string") {
            post.accounts_liked = JSON.parse(post.accounts_liked);
          }
        }
        const comments = post.comments;
        State.update({
          blogPostContent: content,
          blogPostComments: comments,
          blogPostLikes: post.accounts_liked,
        });
      } else {
        State.update({
          blogPostExists: false,
        });
      }
    }
  }
});

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

const H2 = styled.h2`
  font-size: 19px;
  line-height: 22px;
  color: 'black;
  margin: 0 0 24px;
  padding: 0 24px;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const breakpoints = {
  mobile: "768px", // this means anything below 768px width is considered mobile
};

const PostContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin: 20px;
  { cursor: pointer; }

  @media (max-width: ${breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const Post = styled.div`
  display: flex;
  background: #ffffff;
  color: #fff;
  border-radius: 8px;
  overflow: hidden;

  // Media query for mobile devices
  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const PostImage = styled.img`
  width: 100%;
  height: 100%;
`;

const ImageContainer = styled.div`
  width: 40%;
  height: 100%;

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%; // full width on mobile
  }
`;

const ContentContainer = styled.div`
  padding: 20px;
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%; // full width on mobile
  }
`;

const PostTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #3f4246;
  margin: 0;
  margin-top: 0.2rem;
  margin-bottom: 1rem;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1.25rem; // larger text on mobile
  }
`;

const PostDate = styled.p`
  color: #999999;
  font-size: 0.8rem;
  margin: 0;
  align-self: flex-end;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.9rem; // slightly larger text on mobile
  }
`;

const renderItem = (item, index) => {
  let content = item.content;
  if (!item.content.type) {
    content = JSON.parse(item.content);
  }

  const markdownObj = parseMarkdown(content.text);
  const title = getFirstHeading(markdownObj);

  const time = new Date(item.block_timestamp / 1000000);
  const formattedDate = time.toLocaleDateString();

  if (content.type !== "md") {
    return null;
  }

  return (
    <Link href={`/${REPL_ACCOUNT}/widget/BlogPostPage?accountId=${item.account_id}&blockHeight=${item.block_height}`}>
      <Post key={index}>
        <ImageContainer>
          <PostImage
            src={markdownObj[0].imageUrl || "https://pages.near.org/wp-content/uploads/2023/06/generic-green-blog.png"}
            alt="Post image"
          />
        </ImageContainer>
        <ContentContainer>
          <PostDate>{formattedDate}</PostDate>
          <PostTitle>{title.text}</PostTitle>
        </ContentContainer>
      </Post>
    </Link>
  );
};

const renderedItems = posts?.map(renderItem, index);

return (
  <div style={{ background: "#f7f7f7", padding: "4em 2em" }}>
    <H2>Latest posts</H2>
    <PostContainer>{renderedItems}</PostContainer>
  </div>
);

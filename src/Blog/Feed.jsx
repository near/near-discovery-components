const GRAPHQL_ENDPOINT = props.GRAPHQL_ENDPOINT || "https://near-queryapi.api.pagoda.co";

const contributors = props.contributors || [];
const blogComponentUrl = props.blogComponentUrl || "bosblog";
const { requestAuthentication, returnLocation, profileAccountId } = props;
const [posts, setPosts] = useState([]);
const promotedPostsQuery = `
query PromotedPostsQuery {
  dataplatform_near_feed_promoted_blog_posts(
    order_by: {block_height: desc}
    where: {
      _and: {
        promoter_account_id: {_in: ${JSON.stringify(contributors)}}
      }
    }
  ) {
    promoter_account_id
    promote_block_height
    promotion_type
    content
    account_id
    block_height
    block_timestamp
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

fetchGraphQL(promotedPostsQuery, "PromotedPostsQuery", {}).then((result) => {
  if (result.status === 200) {
    if (result.body.data) {
      const posts = result.body.data.dataplatform_near_feed_promoted_blog_posts;
      setPosts(posts);
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
        currentHeader = null;
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

const Container = styled.div`
  display: flex;
  max-width: 1224px;
  margin: 0 auto;
  gap: ${(p) => p.gap ?? "var(--section-gap)"};
  flex-direction: column;
  align-items: ${(p) => (p.center ? "center" : undefined)};
  justify-content: ${(p) => (p.center ? "center" : undefined)};
  text-align: ${(p) => (p.center ? "center" : undefined)};
`;

const Flex = styled.div`
  display: flex;
  gap: ${(p) => p.gap};
  align-items: ${(p) => p.alignItems};
  justify-content: ${(p) => p.justifyContent};
  flex-direction: ${(p) => p.direction ?? "row"};
  flex-wrap: ${(p) => p.wrap ?? "nowrap"};

  ${(p) =>
    p.mobileStack &&
    `
    @media (max-width: 900px) {
      flex-direction: column;
    }
  `}

  @media (max-width: 900px) {
    gap: ${(p) => p.mobileGap ?? p.gap};
    align-items: ${(p) => p.mobileAlignItems ?? p.alignItems};
  }
`;

const Grid = styled.div`
  display: grid;
  gap: ${(p) => p.gap};
  grid-template-columns: ${(p) => p.columns};
  align-items: ${(p) => p.alignItems};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: ${(p) => p.mobileGap ?? p.gap};
  }
`;

const Wrapper = styled.div`
  --section-gap: 120px;
  --text-hero: 500 72px/1 "FK Grotesk", "Mona Sans", sans-serif;
  margin-top: calc(var(--body-top-padding) * -1);

  .darkButton {
    color: #fff !important;
    background: transparent !important;
    border-color: #fff !important;
    &:focus {
      border-color: var(--violet9) !important;
    }
    &:hover {
      color: #000 !important;
      background: #fff !important;
    }
    &:active {
      color: #000 !important;
      background: var(--sand3) !important;
      border-color: var(--sand3) !important;
    }
  }

  @media (max-width: 900px) {
    --section-gap: 80px;
  }
`;

const Section = styled.div`
  --background-color: ${(p) => p.backgroundColor};
  background-color: var(--background-color);
  position: relative;
  padding: 160px 24px;
  overflow: hidden;

  @media (max-width: 900px) {
    padding: var(--section-gap) 24px;
  }
`;

const BlogPost = styled("Link")`
  display: flex;
  flex-direction: column;
  gap: 24px;
  text-decoration: none !important;
  outline: none;
  box-shadow: 0 0 0 0px var(--violet4);

  &:hover {
    h3 {
      text-decoration: underline;
    }

    div:first-child {
      &::before {
        opacity: 1;
      }
    }
  }

  &:focus {
    div:first-child {
      box-shadow: 0 0 0 4px var(--violet4);
    }
  }
`;
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
  mobile: "1100px",
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

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const PostImage = styled.div`
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  height: 220px;
  transition: all 200ms;
  position: relative;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: relative;
    z-index: 5;
  }

  &::before {
    content: "";
    display: block;
    inset: 0;
    background: var(--whiteA6);
    z-index: 10;
    position: absolute;
    opacity: 0;
    transition: all 200ms;
  }
`;

const Text = styled.p`
  font: var(--${(p) => p.size ?? "text-base"});
  font-weight: ${(p) => p.fontWeight} !important;
  color: var(--${(p) => p.color ?? "sand12"});
  margin: 0;

  @media (max-width: 900px) {
    font: var(--${(p) => p.mobileSize ?? p.size ?? "text-base"});
  }
`;

const ImageContainer = styled.div`
  width: 40%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
  }
`;

const ContentContainer = styled.div`
  padding: 20px;
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
  }
`;
const PostTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: #3f4246;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1.25rem;
  }
`;

const PostDate = styled.p`
  color: #999999;
  font-size: 0.8rem;
  margin: 0;
  align-self: flex-end;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.9rem;
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
  const options = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = time.toLocaleDateString("en-US", options);

  if (content.type !== "md") {
    return null;
  }

  const BlogPage = ({ destination }) => {
    return (
      <BlogPost key={index} href={destination}>
        <PostImage>
          <img
            alt="Blog Post image"
            src={
              markdownObj[0].imageUrl ||
              "https://ipfs.near.social/ipfs/bafkreiatutmf7b7siy2ul7ofo7cmypwc3qlgwseoij3gdxuqf7xzcdguia"
            }
          />
        </PostImage>

        <Text size="text-l" fontWeight="500" as="h3">
          {title.text}
        </Text>
        <Text>{formattedDate}</Text>
      </BlogPost>
    );
  };

  // ensures the go back button goes back to the right location
  if (returnLocation === "userprofile") {
    return (
      <BlogPage
        destination={`/near/widget/BlogPostPage?accountId=${item.account_id}&blockHeight=${item.block_height}&returnLocation=/near/widget/ProfilePage?accountId=${profileAccountId}&tab=blog`}
      />
    );
  }

  return (
    <BlogPage
      destination={`/${blogComponentUrl}?accountId=${item.account_id}&blockHeight=${item.block_height}&returnLocation=${props.returnLocation}&profileAccountId=${props.profileAccountId}`}
    />
  );
};

return (
  <Wrapper>
    <Container>
      <Section style={{ padding: "72px 0" }}>
        <Flex direction="column" gap="30px">
          <Flex direction="column" gap="24px">
            <Text size="text-3xl" mobileSize="text-l" fontWeight="500">
              Latest posts
            </Text>
          </Flex>
          <Grid columns="1fr 1fr 1fr" gap="24px" mobileGap="48px">
            {posts.map(renderItem, index)}
          </Grid>
        </Flex>
      </Section>
    </Container>
  </Wrapper>
);

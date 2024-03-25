const GRAPHQL_ENDPOINT = props.GRAPHQL_ENDPOINT || "https://near-queryapi.api.pagoda.co";

//place id of the post you want to fetch from the dataplatform_near_social_feed_moderated_posts table
const blogPostIds = [76994, 76797, 75675, 76460];
const contributors = props.contributors || [];
const requestAuthentication = props.requestAuthentication;

const [posts, setPosts] = useState([]);
const [blogPosts, setBlogPosts] = useState([]);

console.log("here are the contributors", contributors);

const promotedPostsQuery = `
query PromotedPostsQuery {
  jacksonthedev_near_promote2_v1_promote(
    
    order_by: {block_height: desc}
    where: {
      _and: {
        account_id: {_in: ${JSON.stringify(contributors)}}
      }
    }
  ) {
    account_id
    block_height
    block_timestamp
    receipt_id
    promotion_type
    raw_promotion
    content
    post_id
  }
}
`;
function fetchGraphQL(operationsDoc, operationName, variables) {
  return asyncFetch(`${GRAPHQL_ENDPOINT}/v1/graphql`, {
    method: "POST",
    headers: { "x-hasura-role": "jacksonthedev_near" },
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
      const posts = result.body.data.jacksonthedev_near_promote2_v1_promote;
      console.log("here are the posts ln 111", posts);

      if (posts.length > 0) {
        const postsToDisplay = posts.map((post) => {
          const promotion = JSON.parse(post.raw_promotion);
          const promotedPostAccountId = promotion.value.post.path.split("/")[0];
          const promotedPostBlockHeight = promotion.value.post.blockHeight;
          let content = JSON.parse(post.content);
          if (post.accounts_liked.length !== 0) {
            if (typeof post.accounts_liked === "string") {
              post.accounts_liked = JSON.parse(post.accounts_liked);
            }
          }
          const comments = post.comments;
          setBlogPosts([
            ...posts,
            {
              blogPostContent: content,
              blogPostComments: comments,
              blogPostLikes: post.accounts_liked,
            },
          ]);
          return {
            ...post,
            block_height: promotedPostBlockHeight,
            account_id: promotedPostAccountId,
            blogPostContent: content,
            blogPostComments: comments,
            blogPostLikes: post.accounts_liked,
          };
        });

        setPosts(postsToDisplay);
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
  gap: 6px;
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
  margin-bottom: 10px;
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
  const formattedDate = time.toLocaleDateString();

  if (content.type !== "md") {
    return null;
  }

  return (
    <BlogPost key={index} href={`/bosblog?accountId=${item.account_id}&blockHeight=${item.block_height}`}>
      {/* <ImageContainer> */}
      <PostImage>
        <Widget
          src="${REPL_MOB}/widget/Image"
          props={{
            image: {
              ipfs_cid:
                markdownObj[0].imageUrl.split("/")[4] ||
                "https://ipfs.near.social/ipfs/bafkreiatutmf7b7siy2ul7ofo7cmypwc3qlgwseoij3gdxuqf7xzcdguia",
            },
          }}
        />
      </PostImage>
      {/* </ImageContainer> */}
      {/* <ContentContainer> */}
      {/* <PostDate>{formattedDate}</PostDate> */}
      <Text>{formattedDate}</Text>
      {/* <PostTitle>{title.text}</PostTitle> */}
      <Text size="text-l" fontWeight="500" as="h3">
        {title.text}
      </Text>
      {/* <PostTitle></PostTitle> */}
      {/* </ContentContainer> */}
    </BlogPost>
  );
};

return (
  <Wrapper>
    <Container className="container-xl">
      <H2>Latest posts</H2>
      {/* <PostContainer>{renderedItems}</PostContainer> */}
      <Flex direction="column" gap="60px">
        <Grid columns="1fr 1fr 1fr" gap="24px" mobileGap="48px">
          {/* {posts.map(renderItem, index)} */}
          {posts.map((item, index) => {
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
              <BlogPost key={index} href={`/bosblog?accountId=${item.account_id}&blockHeight=${item.block_height}`}>
                {/* <ImageContainer> */}
                <PostImage>
                  <Widget
                    src="${REPL_MOB}/widget/Image"
                    props={{
                      image: {
                        ipfs_cid:
                          markdownObj[0].imageUrl.split("/")[4] ||
                          "https://ipfs.near.social/ipfs/bafkreiatutmf7b7siy2ul7ofo7cmypwc3qlgwseoij3gdxuqf7xzcdguia",
                      },
                    }}
                  />
                </PostImage>
                {/* </ImageContainer> */}
                {/* <ContentContainer> */}
                {/* <PostDate>{formattedDate}</PostDate> */}
                <Text>{formattedDate}</Text>
                {/* <PostTitle>{title.text}</PostTitle> */}
                <Text size="text-l" fontWeight="500" as="h3">
                  {title.text}
                </Text>
                {/* <PostTitle></PostTitle> */}
                {/* </ContentContainer> */}
              </BlogPost>
            );
          })}
        </Grid>
      </Flex>
    </Container>
  </Wrapper>
);

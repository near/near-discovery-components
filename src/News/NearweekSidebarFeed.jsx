const accountId = "near";
const limit = props.limit || 5;
let posts = [];

const indexedPosts = Social.index("post", "main", {
  accountId,
  limit: limit,
  order: "desc",
});

if (indexedPosts?.length > 0) {
  posts = [];

  indexedPosts.forEach((post) => {
    const data = Social.get(`${post.accountId}/post/main`, post.blockHeight);
    if (data) {
      const json = JSON.parse(data);
      const content = json.text.split("\n");
      const title = content[0] || "";
      const url = content[1] || content[2] || "";
      const lastLine = content.pop() || "";
      const hasNewsTag = lastLine.indexOf("#news") > -1;
      const isValid = hasNewsTag && url.indexOf("https://") > -1;

      if (isValid) {
        const timeResponse = fetch(`https://api.near.social/time?blockHeight=${post.blockHeight}`);
        let createdAt = "";
        if (timeResponse) {
          const timeMs = parseFloat(timeResponse.body);
          createdAt = new Date(timeMs).toISOString();
          posts.push({
            blockHeight: post.blockHeight,
            title,
            url,
            thumbnail: "https://near.org/favicon.png",
            createdAt: new Date(timeMs).toISOString(),
            categories: ["Near ORG", "blog"],
          });
          posts.sort((a, b) => b.blockHeight - a.blockHeight);
        }
      }
    }
  });
}

const data = fetch("https://nearweek.com/api/md/dao-news?populate=deep&sort=createdAt:desc&pagination[pageSize]=5", {
  //subscribe: true,
  method: "GET",
  headers: {
    Accept: "*/*",
    Authorization:
      "Bearer 15699f0723aa9fe9f655b1a94e450552476c08807f67b525b5a3c8011eecc8aee6d45923443620f17815b897858be058cd7bd89ddf23a28aabaecb178e7ebc55d380293beeb51a8ce87b40e1518ce4708e4d51a06b115f27fa64ab5cbee5a3511cec785d7ae6a155ecd05ac8196aadae3e9b8e9401b8df8d8b69904f7364f925",
  },
});

const cssFont = fetch("https://fonts.cdnfonts.com/css/hubot-sans").body;

if (!cssFont) return "";

if (!state.theme) {
  State.update({
    theme: styled.div`
      font-family: "Mona Sans", sans-serif;
      ${cssFont}
    `,
  });
}
const Theme = state.theme;

const Wrapper = styled.div`
  display: grid;
  margin-bottom: 12px;
  gap: 2px;
`;

const H2 = styled.h2`
  font-size: 19px;
  font-weight: 700;
  line-height: 22px;
  color: #11181c;
  letter-spacing: -0.02em;
  margin: 0;
`;

const Content = styled.div`
  display: grid;
  margin: 36px 0 24px 0;
  gap: 24px;
  width: 100%;
`;

const Card = styled.div`
  display: flex;
  @media (max-width: 768px) {
    display: ${(props) => (props.$index > 4 ? "none" : "flex")};
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 0;
  margin-left: 1rem;
  flex: 1;
`;

const CardTitle = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: -0.02em;
  color: #000000;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  a {
    color: inherit;
  }
`;

const CardImage = styled.img`
  border-radius: var(--bs-border-radius);
  border: 0.5px solid hsla(210, 12%, 93%, 1);
  width: ${(p) => p.$width}px;
  height: ${(p) => p.$height}px;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardDate = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: hsla(198, 4%, 45%, 1);
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 8px;
  letter-spacing: -0.02em;
`;

const ClockIcon = styled.i`
  font-size: 11px;
`;

const Badges = styled.div`
  display: flex;
  gap: 6px;
`;

const Badge = styled.span`
  border: 1px solid;
  border-color: hsla(214, 10%, 86%, 1);
  border-radius: 4px;
  font-weight: 500;
  font-size: 8px;
  line-height: 8px;
  padding: 2px 4px;
  text-transform: uppercase;
  color: hsla(204, 5%, 44%, 1);
`;

const ButtonLink = styled.a`
  display: block;
  width: 100%;
  padding: 8px;
  height: 32px;
  background: #fbfcfd;
  border: 1px solid #d7dbdf;
  border-radius: 50px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  cursor: pointer;
  color: #11181c !important;
  margin: 0;

  &:hover,
  &:focus {
    background: #ecedee;
    text-decoration: none;
    outline: none;
  }
`;

const news = [...(data?.body?.data ?? []), ...posts]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, limit);
const nwSite = "https://nearweek.com";

function dateToDays(date) {
  const timeAgo = (diffSec) =>
    diffSec < 60000
      ? `${(diffSec / 1000) | 0}s`
      : diffSec < 3600000
        ? `${(diffSec / 60000) | 0}m`
        : diffSec < 86400000
          ? `${(diffSec / 3600000) | 0}h`
          : `${(diffSec / 86400000) | 0}d`;

  var d = new Date(date);
  return timeAgo(Date.now() - d.getTime());
}

return (
  <Theme>
    {news && news.length > 0 ? (
      <Wrapper>
        <H2>News</H2>
        <Content>
          {news.map((item, index) => (
            <Card key={`${item.title?.substring(0, 8)?.replace(/ /g, "_")}_${index}`} $index={index}>
              <div className="d-flex flex-grow-1">
                <CardImage $width="78" $height="78" src={item.thumbnail} alt="" />
                <CardContent>
                  <CardTitle>
                    <a href={item.url} target="_blank" rel="noreferrer noopener">
                      {item.title}
                    </a>
                  </CardTitle>
                  <CardFooter>
                    <Badges>
                      {item.categories.length > 0 && item.categories.map((category) => <Badge>{category}</Badge>)}
                    </Badges>
                    <CardDate>
                      <ClockIcon className="ph ph-clock" />
                      {item.createdAt ? `${dateToDays(item.createdAt)} ago` : ""}
                    </CardDate>
                  </CardFooter>
                </CardContent>
              </div>
            </Card>
          ))}
        </Content>
        <ButtonLink href="${REPL_NEARWEEK}/widget/nearweek.com" target="_blank">
          View All News
        </ButtonLink>
      </Wrapper>
    ) : (
      <div>Loading ...</div>
    )}
  </Theme>
);

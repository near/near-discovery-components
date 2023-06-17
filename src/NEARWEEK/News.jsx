const accountId = "near";
const limit = 5;
let posts = [];

const indexedPosts = Social.index("post", "main", {
  accountId,
  limit: 20,
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
        const block = Near.block(post.blockHeight);
        let createdAt = "";
        if (block) {
          const timeMs = parseFloat(block.header.timestamp_nanosec) / 1e6;
          createdAt = new Date(timeMs).toISOString();
        }
        posts.push({
          blockHeight: post.blockHeight,
          title,
          url,
          thumbnail: "https://near.org/favicon.png",
          createdAt,
          categories: ["Near ORG", "blog"],
        });

        posts.sort((a, b) => b.blockHeight - a.blockHeight);
      }
    }
  });
}

const data = fetch(
  "https://nearweek.com/api/md/dao-news?populate=deep&sort=createdAt:desc&pagination[pageSize]=5",
  {
    //subscribe: true,
    method: "GET",
    headers: {
      Accept: "*/*",
      Authorization:
        "Bearer 15699f0723aa9fe9f655b1a94e450552476c08807f67b525b5a3c8011eecc8aee6d45923443620f17815b897858be058cd7bd89ddf23a28aabaecb178e7ebc55d380293beeb51a8ce87b40e1518ce4708e4d51a06b115f27fa64ab5cbee5a3511cec785d7ae6a155ecd05ac8196aadae3e9b8e9401b8df8d8b69904f7364f925",
    },
  }
);

if (!state.theme) {
  State.update({
    theme: styled.div`
    font-family: "Mona Sans", sans-serif;
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
  color: #11181C;
  margin: 0;
`;

const ClockIconSVG = () => {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.91345 2.39779V5.19946H7.01471M9.11597 5.19946C9.11597 5.75134 9.00727 6.29782 8.79607 6.8077C8.58487 7.31757 8.27532 7.78085 7.88508 8.17109C7.49484 8.56133 7.03156 8.87088 6.52168 9.08208C6.01181 9.29328 5.46533 9.40198 4.91345 9.40198C4.36157 9.40198 3.81509 9.29328 3.30522 9.08208C2.79535 8.87088 2.33206 8.56133 1.94183 8.17109C1.55159 7.78085 1.24203 7.31757 1.03083 6.8077C0.819639 6.29782 0.710937 5.75134 0.710938 5.19946C0.710938 4.08489 1.1537 3.01596 1.94183 2.22784C2.72995 1.43971 3.79888 0.996948 4.91345 0.996948C6.02803 0.996948 7.09695 1.43971 7.88508 2.22784C8.6732 3.01596 9.11597 4.08489 9.11597 5.19946Z"
        stroke="#6F7679"
        stroke-width="0.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

const Content = styled.div`
  display: grid;
  margin: 36px 0 24px 0;
  gap: 24px;
  width: 100%;`;

const Card = styled.div`
    display: flex;
    @media (max-width: 768px) {
      display:   ${(props) => (props.index > 4 ? "none" : "flex")}; 
    }
`;

const CardContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 0;
    margin-left: 1rem;
`;

const CardTitle = styled.div`
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
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
    min-width: 78px;
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
  background: #FBFCFD;
  border: 1px solid #D7DBDF;
  border-radius: 50px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  cursor: pointer;
  color: #11181C !important;
  margin: 0;

  &:hover,
  &:focus {
    background: #ECEDEE;
    text-decoration: none;
    outline: none;
  }
`;

const news = [...(data?.body.data ?? []), ...posts]
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
    {data !== null ? (
      <Wrapper>
        <H2>News</H2>
        <Content>
          {news.map((item, index) => (
            <Card index={index}>
              <div class="d-flex">
                <CardImage width="78" height="78" src={item.thumbnail} alt="" />
                <CardContent>
                  <CardTitle>
                    <a href={article.url} target="_blank">
                      {item.title}
                    </a>
                  </CardTitle>
                  <CardFooter>
                    <Badges>
                      {item.categories.length > 0 &&
                        item.categories.map((category) => (
                          <Badge>{category}</Badge>
                        ))}
                    </Badges>
                    <CardDate>
                      <ClockIconSVG />
                      {item.createdAt
                        ? `${dateToDays(item.createdAt)} ago`
                        : ""}
                    </CardDate>
                  </CardFooter>
                </CardContent>
              </div>
            </Card>
          ))}
        </Content>
        <ButtonLink href="https://nearweek.com" target="_blank">
          View All News
        </ButtonLink>
      </Wrapper>
    ) : (
      <div>Loading ...</div>
    )}
  </Theme>
);

const data = fetch(
  "https://nearweek.com/api/editions?populate=deep&sort=createdAt:desc&pagination[pageSize]=1",
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

const cssFont = fetch("https://fonts.cdnfonts.com/css/hubot-sans").body;

if (!cssFont) return "";

if (!state.theme) {
  State.update({
    theme: styled.div`
    font-family: 'Mona Sans', sans-serif;
    font-style: normal;
    ${cssFont}
`,
  });
}
const Theme = state.theme;

const ButtonLink = styled.a`
  padding: 8px;
  height: 32px;
  border: 1px solid #d7dbdf;
  border-radius: 100px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  cursor: pointer;
  color: ${(p) => (p.primary ? "#006ADC" : "#11181C")} !important;
  background: #fbfcfd;
  white-space: nowrap;

  &:hover,
  &:focus {
    background: #ecedee;
    text-decoration: none;
    outline: none;
  }
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #eceef0;
  box-shadow: 0px 1px 3px rgba(16, 24, 40, 0.1),
    0px 1px 2px rgba(16, 24, 40, 0.06);
  overflow: hidden;
`;

const CardTitle = styled.h2`
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
`;

const CardBody = styled.div`
  padding: 24px 20px 24px  18px;
  display: flex;
  gap: 16px;
  align-items: center;

  > * {
    min-width: 0;
  }
`;

const CardContent = styled.div`
  font-size: 10px;
  font-weight: 400;
  line-height: 13px;
  letter-spacing: -0.02em;
  color: hsla(0, 0%, 0%, 1);
  width: 100%;
`;

const CardFooter = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 16px;
  border-top: 1px solid #eceef0;
`;

function formatDate(dateString) {
  const date = new Date(dateString);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayOfWeek = dayNames[date.getDay()];
  const dayOfMonth = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${dayOfWeek} ${dayOfMonth} ${month}, ${year}`;
}

const issue = data.body.data[0];
const nwSite = "https://nearweek.com";

return (
  <Theme>
    {issue !== null ? (
      <Card>
        <CardBody>
          <CardContent>
            <div class="d-flex clearfix">
              <div class="d-flex">
                <img
                  class="rounded"
                  width="77"
                  height="77"
                  src={nwSite + issue.Thumbnail.url}
                  alt={issue.Thumbnail.alternativeText}
                />
                <div class="d-flex flex-column ms-3 mt-0">
                  <CardTitle>
                    {"Newsletter - NO"} {issue.Number ? issue.Number : ""}
                  </CardTitle>
                  <p>
                    A weekly update on everything that moves NEAR Protocol{" "}
                    {issue.publishedAt ? formatDate(issue.publishedAt) : ""}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </CardBody>
        <CardFooter>
          <ButtonLink
            href={"https://nearweek.com/newsletters/" + issue.slug}
            target="_blank"
          >
            Read
          </ButtonLink>
          <ButtonLink
            href="https://subscribe.nearweek.com"
            target="_blank"
            primary
          >
            Subscribe
          </ButtonLink>
        </CardFooter>
      </Card>
    ) : (
      <div>Loading ...</div>
    )}
  </Theme>
);

///use:
// {<Avatar
//     onClick={() => {
//       trackEngagement({
//         targetSigner: props.accountId,
//         rank: props.rank,
//         eventType: "people page avatar profile entry",
//       });
//     }}
//     href={profileUrl}
//   >
//     <Widget
//       src="${REPL_MOB}/widget/Image"
//       props={{
//         image: props.profileImage || profile.image,
//         alt: props.profileName || profile.name,
//         fallbackUrl:
//           "https://ipfs.near.social/ipfs/bafkreibiyqabm3kl24gcb2oegb7pmwdi6wwrpui62iwb44l7uomnn3lhbi",
//       }}
//     />
//   </Avatar>
//   <CenteredLinksWrapper
//     onClick={() => {
//       trackEngagement({
//         targetSigner: props.accountId,
//         rank: props.rank,
//         eventType: "people page profile entry",
//       });
//     }}
//   >
//     <TextLink href={profileUrl} ellipsis bold>
//       {props.profileName || profile.name || accountId.split(".near")[0]}
//     </TextLink>
//     <TextLink href={profileUrl} ellipsis>
//       @{accountId}
//     </TextLink>
//   </CenteredLinksWrapper>

// }

///////////////
//const dataplane = "https://neardanieossax.dataplane.rudderstack.com"; //test
const dataplane = "https://near.dataplane.rudderstack.com"; //prod
const uri = "/v1/track";
const api_url = `${dataplane}${uri}`;
//const auth = "Basic MlVvMlBYSE9UdzJjUWRucThJUWJQTG9DOG5mOg=="; //test
const auth = "Basic MlVub3dMd2lXRnc3YzM1QU11RUVkREVJa2RvOg=="; //prod
const currentTimeStamp = new Date().toISOString();

const trackEngagement = (targetSigner, eventType, rank) => {
  const payload = {
    userId: context.accountId,
    event: eventType,
    properties: {
      targetSignerId: targetSigner,
      rank: rank,
    },
    timestamp: new Date().toISOString(),
  };

  asyncFetch(api_url, {
    body: JSON.stringify({ payload }),
    headers: {
      "Content-Type": "application/json",
      Authorization: auth,
    },
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.log("Error:", error));
};
////////////

if (
  !props.accountId ||
  !context.accountId ||
  context.accountId === props.accountId
) {
  return "";
}

const followEdge = Social.keys(
  `${context.accountId}/graph/follow/${props.accountId}`,
  undefined,
  {
    values_only: true,
  }
);

const inverseEdge = Social.keys(
  `${props.accountId}/graph/follow/${context.accountId}`,
  undefined,
  {
    values_only: true,
  }
);

const loading = followEdge === null || inverseEdge === null;
const isFollowing = Object.keys(followEdge || {}).length > 0;
const isInverse = Object.keys(inverseEdge || {}).length > 0;

const type = follow ? "unfollow" : "follow";

const data = {
  graph: { follow: { [props.accountId]: isFollowing ? null : "" } },
  index: {
    graph: JSON.stringify({
      key: "follow",
      value: {
        type,
        accountId: props.accountId,
      },
    }),
    notify: JSON.stringify({
      key: props.accountId,
      value: {
        type,
      },
    }),
  },
};

const Wrapper = styled.div`
  .follow-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 16px;
    height: 32px;
    border-radius: 100px;
    font-weight: 600;
    font-size: 12px;
    line-height: 15px;
    text-align: center;
    cursor: pointer;
    background: #fbfcfd;
    //background: red;
    border: 1px solid #d7dbdf;
    color: #006adc !important;
    white-space: nowrap;

    &:hover,
    &:focus {
      background: #ecedee;
      text-decoration: none;
      outline: none;
    }

    i {
      color: #7e868c;
    }

    .bi-16 {
      font-size: 16px;
    }
  }
`;

return (
  <Wrapper className={props.className}>
    <CommitButton disabled={loading} className="follow-button" data={data}>
      {isFollowing && <i className="bi-16 bi bi-check"></i>}
      {isFollowing ? "Following" : isInverse ? "Follow Back" : "Follow"}
    </CommitButton>
  </Wrapper>
);

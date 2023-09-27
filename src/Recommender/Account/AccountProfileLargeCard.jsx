const accountId = props.accountId;
const profile = props.profile || Social.get(`${accountId}/profile/**`, "final");
const tags = Object.keys(profile.tags || {});
const profileUrl = `#/near/widget/ProfilePage?accountId=${accountId}`;

const abbreviateNumber = (value) => {
  let newValue = value;
  if (value >= 1000) {
    const suffixes = ["", "k", "M"];
    let suffixNum = 0;
    if (value < 1000000) {
      suffixNum = 1; // Use 'k'
    } else if (value < 1000000000) {
      suffixNum = 2; // Use 'M'
    }
    const shortValue = (value / Math.pow(1000, suffixNum)).toFixed(1);
    newValue = shortValue + suffixes[suffixNum];
  }
  return newValue;
};

const Avatar = styled.a`
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border: 1px solid #eceef0;
  overflow: hidden;
  border-radius: 56px;
  transition: border-color 200ms;

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  &:hover,
  &:focus {
    border-color: #d0d5dd;
  }
`;

const Button = styled.div`
  div > .follow-button {
    color: #000 !important;
  }
`;

const CurrentUserProfile = styled.div`
  height: 32px;
`;

const NoTags = styled.div`
  height: 20px;
`;

const Score = styled.li`
  font-size: 12px;
  font-weight: 500;
  color: #90908c;
  i {
    font-size: 12px;
    font-weight: 900;
    color: #90908c;
  }
`;

const Scores = styled.ul`
  display: flex;
  justify-content: space-around;
  align-items: left;
  width: 100%;
  margin-bottom: 0px;
  padding: 0px 40px 14px;
  border-bottom: 1px solid #eceef0;
  color: #90908c;
  list-style-type: none;
  min-height: 32px;
`;

const TagsWrapper = styled.div`
  max-width: 80%;
  margin-top: -5px;
`;

const TextLink = styled.a`
  display: block;
  margin: 0;
  font-size: 14px;
  line-height: 18px;
  color: ${(p) => (p.bold ? "#11181C !important" : "#687076 !important")};
  font-weight: ${(p) => (p.bold ? "600" : "400")};
  font-size: ${(p) => (p.small ? "12px" : "14px")};
  overflow: ${(p) => (p.ellipsis ? "hidden" : "visible")};
  text-overflow: ${(p) => (p.ellipsis ? "ellipsis" : "unset")};
  white-space: nowrap;
  outline: none;
  max-width: 230px;

  &:focus,
  &:hover {
    text-decoration: underline;
  }
`;

const ProfileListContainer = styled.div`
  width: auto;
  position: relative;
  font-size: 14px;
  color: #90908c;
`;

const ProfileList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  height: 100%;
  font-size: 14px;
  color: #90908c;
`;

const Profile = styled.li`
  padding: 0px;
`;

const FollowsYouBadge = styled.p`
  display: inline-block;
  margin: 0px;
  font-size: 10px;
  line-height: 1.1rem;
  background: rgb(104, 112, 118);
  color: rgb(255, 255, 255);
  font-weight: 600;
  white-space: nowrap;
  padding: 2px 6px;
  border-radius: 3px;
`;

const LargeCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  width: 100%;
  border-radius: 12px;
  z-index: 1070;
  background: #fff;
  border: 1px solid #eceef0;
  box-shadow: 0px 1px 3px rgba(16, 24, 40, 0.1),
    0px 1px 2px rgba(16, 24, 40, 0.06);
  overflow: hidden;
  padding: 24px 0px 13px;
`;

const CenteredLinksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 14px;
`;
return (
  <LargeCard>
    <Avatar href={profileUrl}>
      <Widget
        src="${REPL_MOB}/widget/Image"
        props={{
          image: props.profileImage || profile.image,
          alt: props.profileName || profile.name,
          fallbackUrl:
            "https://ipfs.near.social/ipfs/bafkreibiyqabm3kl24gcb2oegb7pmwdi6wwrpui62iwb44l7uomnn3lhbi",
        }}
      />
    </Avatar>
    <CenteredLinksWrapper>
      <TextLink href={profileUrl} ellipsis bold>
        {props.profileName || profile.name || accountId.split(".near")[0]}
      </TextLink>
      <TextLink href={profileUrl} ellipsis>
        @{accountId}
      </TextLink>
    </CenteredLinksWrapper>
    {tags.length > 0 ? (
      <TagsWrapper>
        <Widget src="near/widget/Tags" props={{ tags, scroll: true }} />
      </TagsWrapper>
    ) : (
      <TagsWrapper>
        <NoTags></NoTags>
      </TagsWrapper>
    )}

    {props.following !== null &&
    props.followers !== null &&
    props.likers !== null ? (
      <Scores>
        {props.followers > 0 && (
          <Score>
            <OverlayTrigger
              key={placement}
              placement={placement}
              overlay={<Tooltip>Followers</Tooltip>}
            >
              <div>
                <i class="bi bi-person"></i>
                {abbreviateNumber(props.followers)}
              </div>
            </OverlayTrigger>
          </Score>
        )}
        {props.following > 0 && (
          <Score>
            <OverlayTrigger
              key={placement}
              placement={placement}
              overlay={<Tooltip>Following</Tooltip>}
            >
              <div>
                <i class="bi bi-person-gear"></i>
                {abbreviateNumber(props.following)}
              </div>
            </OverlayTrigger>
          </Score>
        )}
        {props.likers > 0 && (
          <Score>
            <OverlayTrigger
              key={placement}
              placement={placement}
              overlay={<Tooltip>Likes received</Tooltip>}
            >
              <div>
                <i class="bi bi-heart"></i>
                {abbreviateNumber(props.likers)}
              </div>
            </OverlayTrigger>
          </Score>
        )}
      </Scores>
    ) : (
      <Scores>
        <Score></Score>
      </Scores>
    )}

    {context.accountId && context.accountId !== props.accountId ? (
      <Button>
        <Widget
          src="${REPL_ACCOUNT}/widget/FollowButton"
          props={{
            accountId: props.accountId,
          }}
        />
      </Button>
    ) : (
      <Button>
        <CurrentUserProfile></CurrentUserProfile>
      </Button>
    )}
  </LargeCard>
);

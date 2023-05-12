const accountId = props.accountId;
const profile = props.profile || Social.get(`${accountId}/profile/**`, "final");
const tags = profile && profile.tags ? Object.keys(profile.tags) : {};
const profileUrl = `/#/near/widget/ProfilePage?accountId=${accountId}`;
const onPointerUp =
  props.onClick ??
  ((event) => {
    if (props.debug) {
      console.log("click", event);
    }
  });

const accountUrl = `/#/near/widget/ProfilePage?accountId=${accountId}`;

let followers = Social.keys(`*/graph/follow/${accountId}`, "final", {
  return_type: "BlockHeight",
  values_only: true,
});

State.init({
  show: false,
});

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3;
  padding: 8px;
  word-wrap: break-word; // Added to wrap the text
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  height: 100%;
  overflow: hidden;
`;

const Card = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  width: 100%;
  border-radius: 16px;
  background: #fff;
  overflow: hidden;
  padding: 16px;
  width: 408px;
  height: 88px;
`;

const CardLeft = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center; 
  flex: 1;
  min-width: 0;

  > div {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
  }
`;


const Avatar = styled.a`
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border: 1px solid #ECEEF0;
  overflow: hidden;
  border-radius: 56px;
  transition: border-color 200ms;
  min-width: 60px; // Added to prevent shrinking

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  &:hover,
  &:focus {
    border-color: #D0D5DD;
  }
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
  width:60%;
  overflow:none;
  max-width:200px;

  &:focus,
  &:hover {
    text-decoration: underline;
  }
`;

const TagsWrapper = styled.div`
  padding-top: 4px;
    overflow: visible;
  white-space: normal;
  text-overflow: clip;
`;

const FollowersCount = styled.div`
  font-size: 14px;
  color: #687076;
  margin-top: 4px;
`;

const TabsButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-weight: 600;
  font-size: 12px;
  padding: 0 12px;
  position: relative;
  color: ${(p) => (p.selected ? "#11181C" : "#687076")};
  background: none;
  border: none;
  outline: none;
  text-align: center;
  text-decoration: none !important;

  &:hover {
    color: #11181C;
  }

  &::after {
    content: '';
    display: ${(p) => (p.selected ? "block" : "none")};
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #59E692;
  }
`;

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  } else {
    return num;
  }
}

return (
  <Card>
    <CardLeft>
      <Avatar href={profileUrl} onPointerUp={onPointerUp}>
        <Widget
          src="mob.near/widget/Image"
          props={{
            image: profile.image,
            alt: profile.name,
            fallbackUrl:
              "https://ipfs.near.social/ipfs/bafkreibiyqabm3kl24gcb2oegb7pmwdi6wwrpui62iwb44l7uomnn3lhbi",
          }}
        />
      </Avatar>
    </CardLeft>

    <RightColumn>
      <ProfileInfo>
        <div>
          <TextLink href={profileUrl} onPointerUp={onPointerUp} ellipsis bold>
            {profile.name || accountId.split(".near")[0]}
          </TextLink>
          <TextLink href={profileUrl} onPointerUp={onPointerUp} ellipsis>
            @{accountId}
          </TextLink>
        </div>
        <FollowersCount>
          {/* Replace "123" with the actual follower count */}
          <TabsButton
            href={`${accountUrl}&tab=followers`}
            selected={state.selectedTab === "followers"}
          >
            {formatNumber(Object.keys(followers || {}).length)} Followers
          </TabsButton>
        </FollowersCount>
      </ProfileInfo>
    </RightColumn>
  </Card>
);

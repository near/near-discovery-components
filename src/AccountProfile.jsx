const accountId = props.accountId || context.accountId;
const blockHeight = props.blockHeight;
const blockTimestamp = props.blockTimestamp;
const profileUrl = `/${REPL_ACCOUNT}/widget/ProfilePage?accountId=${accountId}`;
const verifications = props.verifications;
const showFlagAccountFeature = props.showFlagAccountFeature ?? false;
const profile = props.profile || Social.get(`${accountId}/profile/**`, "final");

function returnProfileForUser(user) {
  const rawImage = user.profile_image_1 || user.profile_image_2 || user.profile_image_3;
  const image = rawImage && rawImage.indexOf("http") === 0 ? { url: rawImage } : { ipfs_cid: rawImage };
  const name = user.profile_name ?? "";
  let tags = null;

  if (user.profile_tags) {
    tags = {};
    user.profile_tags.forEach((tag) => (tags[tag] = ""));
  }

  if (image && tags) {
    return {
      image,
      name,
      tags,
    };
  }

  return null;
}
const Wrapper = styled("Link")`
  display: inline-grid;
  width: 100%;
  align-items: center;
  gap: 12px;
  grid-template-columns: auto 1fr;
  cursor: pointer;
  margin: 0;
  color: #687076 !important;
  outline: none;
  text-decoration: none !important;
  background: none !important;
  border: none;
  text-align: left;
  padding: 0;

  > * {
    min-width: 0;
  }

  &:hover,
  &:focus {
    div:first-child {
      border-color: #d0d5dd;
    }
  }
`;

const Text = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: ${(p) => (p.bold ? "#11181C" : "#687076")};
  font-weight: ${(p) => (p.bold ? "600" : "400")};
  font-size: ${(p) => (p.small ? "10px" : "14px")};
  overflow: ${(p) => (p.ellipsis ? "hidden" : "")};
  text-overflow: ${(p) => (p.ellipsis ? "ellipsis" : "")};
  white-space: nowrap !important;
`;

const Avatar = styled.div`
  width: ${props.avatarSize || "40px"};
  height: ${props.avatarSize || "40px"};
  flex-shrink: 0;
  border: 1px solid #eceef0;
  overflow: hidden;
  border-radius: 40px;
  transition: border-color 200ms;

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    margin: 0 !important;
  }
`;

const VerifiedBadge = styled.div`
  position: absolute;
  left: 24px;
  top: 22px;
`;

const Name = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const AccountProfile = (
  <Wrapper
    as={props.onClick ? "button" : "Link"}
    href={!props.onClick && profileUrl}
    onClick={props.onClick && (() => props.onClick(accountId))}
  >
    <Avatar>
      <Widget
        src="${REPL_MOB}/widget/Image"
        props={{
          image: profile.image,
          alt: profile.name,
          fallbackUrl: "https://ipfs.near.social/ipfs/bafkreibiyqabm3kl24gcb2oegb7pmwdi6wwrpui62iwb44l7uomnn3lhbi",
        }}
      />
    </Avatar>

    {verifications && (
      <VerifiedBadge>
        <Widget src="${REPL_ACCOUNT}/widget/Settings.Identity.Verifications.Icon" props={{ type: "base" }} />
      </VerifiedBadge>
    )}

    <div>
      <Name>
        <Text ellipsis bold>
          {profile.name || accountId.split(".near")[0]}
        </Text>

        {props.inlineContent}

        {props.blockHeight && (
          <Text small style={{ marginLeft: "auto" }}>
            Joined <Widget src="${REPL_ACCOUNT}/widget/TimeAgo" props={{ blockHeight, blockTimestamp }} />
            ago
          </Text>
        )}
      </Name>

      {!props.hideAccountId && <Text ellipsis>@{accountId}</Text>}
    </div>
  </Wrapper>
);

if (props.noOverlay) return AccountProfile;

return (
  <Widget
    src="${REPL_ACCOUNT}/widget/AccountProfileOverlay"
    props={{
      accountId: props.accountId,
      profile: returnProfileForUser(profile),
      children: AccountProfile,
      placement: props.overlayPlacement,
      verifications,
      showFlagAccountFeature,
    }}
  />
);

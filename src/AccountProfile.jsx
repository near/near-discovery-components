const accountId = props.accountId || context.accountId;
const profile = props.profile || Social.get(`${accountId}/profile/**`, "final");
const profileUrl = `#/${REPL_ACCOUNT}/widget/ProfilePage?accountId=${accountId}`;

const Wrapper = styled.a`
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

  .hover-state1 {
    opacity: 0;
  }

  .hover-state2 {
    opacity: 1;
  }

  &:hover,
  &:focus {
    div.hover {
      border-color: #d0d5dd;
    }
    .hover-state1 {
      opacity: 1;
      transition: opacity 0.3s ease;
    }
    .hover-state2 {
      opacity: 0;
      transition: opacity 0.3s ease;
    }
  }
`;

const AvatarCount = styled.div`
  color: rgb(104, 112, 118);
  font-size: 14px;
  font-weight: 300;
  position: absolute;
  right: 0px;
  padding-right: 20px;
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
  white-space: nowrap;
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
  }
`;

const Name = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const AccountProfile = (
  <Wrapper
    as={props.onClick ? "button" : "a"}
    href={!props.onClick && profileUrl}
    onClick={props.onClick && (() => props.onClick(accountId))}
  >
    <Avatar className="hover">
      <Widget
        src="${REPL_MOB}/widget/Image"
        props={{
          image: profile.image,
          alt: profile.name,
          fallbackUrl:
            "https://ipfs.near.social/ipfs/bafkreibiyqabm3kl24gcb2oegb7pmwdi6wwrpui62iwb44l7uomnn3lhbi",
        }}
      />
    </Avatar>

    <div>
      <Name>
        <Text ellipsis bold>
          {profile.name || accountId.split(".near")[0]}
        </Text>

        {props.inlineContent}

        {props.blockHeight && (
          <Text small style={{ marginLeft: "auto" }}>
            Joined{" "}
            <Widget
              src="${REPL_MOB_2}/widget/TimeAgo"
              props={{ blockHeight: props.blockHeight }}
            />{" "}
            ago
          </Text>
        )}

        {props.scope == "friends" && props.becauseYouFollow.length > 0 && (
          <>
            <AvatarCount className="hover-state1">
              <Widget
                src="${REPL_ACCOUNT}/widget/Recommender.Views.RecommendedAvatars"
                props={{
                  avatarSize: "25px",
                  becauseYouFollow: props.becauseYouFollow,
                }}
              />
            </AvatarCount>
            <AvatarCount className="hover-state2">
              {props.becauseYouFollow.length} friends follow
            </AvatarCount>
          </>
        )}

        {props.scope == "similar" && (
          <AvatarCount>Shared interests</AvatarCount>
        )}
      </Name>

      {!props.hideAccountId && <Text ellipsis>@{accountId}</Text>}
    </div>
  </Wrapper>
);

if (props.noOverlay) return AccountProfile;

return (
  <>
    <Widget
      src="${REPL_ACCOUNT}/widget/AccountProfileOverlay"
      props={{
        accountId: props.accountId,
        profile,
        children: AccountProfile,
        placement: props.overlayPlacement,
        becauseYouFollow:
          props.scope === "friends" ? props.becauseYouFollow : null,
        scope: props.scope,
        onFollow: { removeListProfileOnFollow },
      }}
    />
  </>
);

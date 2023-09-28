const Avatar = styled.div`
  display: flex;
  width: ${props.avatarSize || "40px"};
  height: ${props.avatarSize || "40px"};
  flex-shrink: 0;
  border: 1px solid #eceef0;
  overflow: hidden;
  border-radius: ${props.avatarSize || "40px"};
  background-color: white;

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

const AvatarContainer = styled.div`
  display: flex;
  padding-right: 7px;

  & > div {
    margin-right: -8px;
    border: 2px solid white;
  }
  & > div:nth-child(n + 4) {
    display: none;
  }
`;

const profiles = props.becauseYouFollow;
const account = Social.get(`${accountId}/profile/**`, "final");
const fourProfiles = profiles.slice(0, 4);

const avatarData = fourProfiles.map((profile) => {
  return Social.get(`${profile}/profile/**`, "final");
});

return (
  <>
    {profiles ? (
      <AvatarContainer>
        {avatarData.map((avatar, index) => (
          <Avatar key={index}>
            <Widget
              src="mob.near/widget/Image"
              props={{
                image: avatar.image,
                alt: avatar.name,
                fallbackUrl:
                  "https://ipfs.near.social/ipfs/bafkreibiyqabm3kl24gcb2oegb7pmwdi6wwrpui62iwb44l7uomnn3lhbi",
              }}
            />
          </Avatar>
        ))}
      </AvatarContainer>
    ) : null}
  </>
);

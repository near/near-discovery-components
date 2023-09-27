const Avatar = styled.div`
  width: ${props.avatarSize || "40px"};
  height: ${props.avatarSize || "40px"};
  flex-shrink: 0;
  border: 1px solid #eceef0;
  overflow: hidden;
  border-radius: ${props.avatarSize || "40px"};

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }uu
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

return (
  <>
    {profiles ? (
      <AvatarContainer>
        {profiles.map((avatar, index) => (
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
            {avatar}
          </Avatar>
        ))}
      </AvatarContainer>
    ) : null}
  </>
);

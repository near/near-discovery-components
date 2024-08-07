const accountId = context.accountId;

if (!accountId) {
  return "Please sign in with NEAR wallet to edit your profile";
}

let profile = Social.getr(`${accountId}/profile`);

if (profile === null) {
  return "Loading";
}

State.init({
  profile,
});

const Wrapper = styled.div`
  #pills-tab,
  #pills-tabContent {
    display: none;
  }
`;

return (
  <Wrapper className="gateway-page-container">
    <div className="row">
      <div className="col-lg-6">
        <div>
          <h4>Edit profile of @{accountId}</h4>
        </div>
        <div className="mb-2">
          <Widget
            src="${REPL_ACCOUNT}/widget/MetadataEditor"
            props={{
              initialMetadata: profile,
              onChange: (profile) => State.update({ profile }),
              options: {
                name: { label: "Name" },
                image: { label: "Profile picture" },
                backgroundImage: { label: "Background image" },
                description: { label: "About" },
                tags: {
                  label: "Tags",
                  tagsPattern: "*/profile/tags/*",
                  placeholder: "rust, engineer, artist, humanguild, nft, learner, founder",
                },
                linktree: {
                  links: [
                    {
                      label: "Twitter",
                      prefix: "https://twitter.com/",
                      name: "twitter",
                    },
                    {
                      label: "Github",
                      prefix: "https://github.com/",
                      name: "github",
                    },
                    {
                      label: "Telegram",
                      prefix: "https://t.me/",
                      name: "telegram",
                    },
                    {
                      label: "Website",
                      prefix: "https://",
                      name: "website",
                    },
                  ],
                },
              },
            }}
          />
        </div>
        <div className="mb-2">
          <CommitButton data={{ profile: state.profile }}>Save profile</CommitButton>
          <Link
            className="btn btn-outline-primary ms-2"
            href={`/${REPL_ACCOUNT}/widget/ProfilePage?accountId=${accountId}`}
          >
            View profile
          </Link>
        </div>
      </div>
      <div className="col-lg-6">
        <div>
          <Widget src="${REPL_ACCOUNT}/widget/ProfilePage" props={{ accountId, profile: state.profile, stack: true }} />
        </div>
      </div>
    </div>
  </Wrapper>
);

const modalOpen = Storage.get("personhood-alert") ?? false;

State.init({
  showBanner: false,
});

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 30px;
`;

const Title = styled.h1`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font: var(--title-xl);
  font-weight: 600;
  font-size: ${(p) => (p.small ? "20px" : "32px")};
  line-height: 30px;
  margin: 0;
  user-select: none;
`;

const Icon = styled.i`
  color: #697177;
  margin-left: .5rem;
  cursor: pointer;
`;

const bannerToggle = () => State.update({ showBanner: !state.showBanner });

return (
  <Wrapper>
    <Title>
      Identity &amp; data privacy
      <Icon className="ph ph-info" onClick={bannerToggle} />
    </Title>

    <Widget
      src="${REPL_ACCOUNT}/widget/Settings.Identity.Banner"
      props={{
        open: state.showBanner,
        onClick: bannerToggle,
      }}
    />

    <Widget src="${REPL_ACCOUNT}/widget/Settings.Identity.Verifications.Index" props={{ ...props }} />

    <Widget
      src="${REPL_ACCOUNT}/widget/Settings.Identity.Alert"
      props={{
        open: modalOpen,
        onOpenChange: () => Storage.set("personhood-alert", !modalOpen),
        onConfirm: props.connectIdOS,
      }}
    />
  </Wrapper>
);

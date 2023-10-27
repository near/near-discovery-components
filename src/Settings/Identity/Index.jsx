const modalOpen = Storage.get("kyc-alert") ?? false;

const [showBanner, setShowBanner] = useState(false);

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

const bannerToggle = useCallback(() => setShowBanner(!showBanner), [showBanner]);

console.log("idosCredentials: ", props.idosCredentials);

return (
  <Wrapper>
    <Title>
      Identity &amp; data privacy
      <Icon className="ph ph-info" onClick={bannerToggle} />
    </Title>

    <Widget
      src="${REPL_ACCOUNT}/widget/Settings.Identity.Banner"
      props={{
        open: showBanner,
        onClick: bannerToggle,
      }}
    />

    {!props.idosConnected && (
      <Widget
        src="${REPL_ACCOUNT}/widget/DIG.Button"
        props={{
          variant: "primary",
          label: "Connect to idOS",
          disabled: disabled ?? !context.accountId,
          onClick: props.connectIdOS,
        }}
      />
    )}

    {props.idosConnected && (
      <Widget src="${REPL_ACCOUNT}/widget/Settings.Identity.Verifications.Index" props={{ ...props }} />
    )}

    <Widget
      src="${REPL_ACCOUNT}/widget/Settings.Identity.Alert"
      props={{
        open: modalOpen,
        onOpenChange: () => Storage.set("kyc-alert", !modalOpen),
        onConfirm: () => {},
      }}
    />
  </Wrapper>
);

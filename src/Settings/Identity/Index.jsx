const [showBanner, setShowBanner] = useState(true);
const [idosData, setIdosData] = useState(null);
const [showSuccessTooltip, setShowSuccessTooltip] = useState(props.showTooltip);

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
  margin-left: 0.5rem;
  cursor: pointer;
`;

const bannerToggle = useCallback(() => setShowBanner(!showBanner), [showBanner]);

useEffect(() => {
  if (!props.idosConnected && props.connectIdOS) {
    props.connectIdOS();
  }
}, [props.idosConnected, props.connectIdOS]);

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
      <Widget
        src="${REPL_ACCOUNT}/widget/Settings.Identity.Verifications.Index"
        props={{ ...props }}
      />
    )}

    {showSuccessTooltip && (
      <Widget
        src="${REPL_ACCOUNT}/widget/DIG.Toast"
        props={{
          type: "success",
          title: "idOS connection successful",
          description:
            "idOS data view created. Your data will be displayed soon when your request has been reviewed and approved (approx 1 - 10 minutes).",
          open: showSuccessTooltip,
          onOpenChange: () => {
            setShowSuccessTooltip(false);
          },
          duration: 10000,
        }}
      />
    )}
  </Wrapper>
);

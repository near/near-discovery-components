let { idosConnected, connectIdOS, walletImages, connectedWallet, idosCreateAccountUrl, ...forwardedProps } = props;

const [showBanner, setShowBanner] = useState(true);
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

useEffect(() => {
  if (connectIdOS) {
    connectIdOS();
  }
}, [connectIdOS]);

return (
  <Wrapper>
    <Title>Identity &amp; data privacy</Title>

    {!idosConnected && (
      <Widget
        src="${REPL_ACCOUNT}/widget/Settings.Identity.Onboarding.Cards"
        props={{
          idosConnected,
          connectIdOS,
          walletImages,
          connectedWallet,
          idosCreateAccountUrl,
        }}
      />
    )}

    {props.idosConnected && (
      <Widget src="${REPL_ACCOUNT}/widget/Settings.Identity.Verifications.Index" props={{ ...forwardedProps }} />
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

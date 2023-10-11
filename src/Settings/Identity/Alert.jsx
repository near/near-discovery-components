let { onCancel, onConfirm, ...forwardedProps } = props;

const idOSVerificationLink = "https://app.staging.sandbox.fractal.id/authorize?client_id=EJcoynygpubqr05TK6vMI--eq_iLHTXrvUFuLLAzfrs&redirect_uri=https%3A%2F%2Fnear.org%2Fnear%2Fwidget%2FProfilePage&response_type=code&scope=contact%3Aread%20verification.basic%3Aread%20verification.basic.details%3Aread%20verification.liveness%3Aread%20verification.liveness.details%3Aread%20verification.idos%3Aread%20verification.idos.details%3Aread%20verification.wallet-near%3Aread%20verification.wallet-near.details%3Aread";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  margin: 0 2.25rem 1.5rem;
`;

const Img = styled.div`
  width: 40px;
  height: 40px;
  background: url(https://ipfs.near.social/ipfs/bafkreifo4koaodxwbkws34aaymzfvlpznxjtwgk4til6i5334hwn4yj3sy)
    center center / cover no-repeat;
  margin: 0 auto;
`;

const Title = styled.h2`
  font: var(--text-base);
  font-weight: 700;
  color: var(--sand12);
  margin: 0;
`;

const Description = styled.div`
  font: var(--text-s);
  color: var(--sand12);
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ListItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ListItem = ({ children }) => (
  <ListItemWrapper>
    <i className="ph ph-check" />
    {children}
  </ListItemWrapper>
);

const Content = () => (
  <Wrapper>
    <Img />
    <Title>Get verified &amp; own your identity data</Title>
    <Description>
      How does it work?
      <ListItem>Verify your identity with Fractal</ListItem>
      <ListItem>Store your data in idOS</ListItem>
      <ListItem>Be the true owner of your data</ListItem>
    </Description>
  </Wrapper>
);

const Cancel = () => (
  <Widget
    src="${REPL_ACCOUNT}/widget/DIG.Button"
    props={{
      label: "Cancel",
      variant: "secondary",
      onClick: onCancel,
      style: { width: "100%" },
    }}
  />
);

const Confirm = () => (
  <Widget
    src="${REPL_ACCOUNT}/widget/DIG.Button"
    props={{
      label: "Get started",
      variant: "primary",
      onClick: onConfirm,
      // href: idOSVerificationLink,
      style: { width: "100%" },
    }}
  />
);

const actionStyles = {
  flexDirection: "column",
  width: "100%",
  alignItems: "stretch",
  justifyContent: "stretch",
};

return (
  <Widget
    src="${REPL_ACCOUNT}/widget/DIG.Dialog"
    props={{
      type: "alert",
      content: <Content />,
      cancelButton: <Cancel />,
      confirmButton: <Confirm />,
      actionStyles,
      ...forwardedProps,
    }}
  />
);

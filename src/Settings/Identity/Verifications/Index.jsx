const { idosCredentials, ...forwardedProps } = props;

const proofOfPersonhoodLink = "https://app.fractal.id/authorize?client_id=7woBwPtlpPAbHSlR_B314ewo1IThzI6dlWNQgW272gU&redirect_uri=https://near.org/&response_type=code&scope=contact:read%20verification.uniqueness:read%20verification.uniqueness.details:read%20verification.uniq:read%20verification.uniq.details:read%20verification.wallet-near:read%20verification.wallet-near.details:read%20verification.wallet-near:read%20verification.wallet-near.details:read%20verification.idos:read%20verification.idos.details:read&user_role=person";

const kycLink = "https://app.fractal.id/authorize?client_id=7woBwPtlpPAbHSlR_B314ewo1IThzI6dlWNQgW272gU&redirect_uri=https://near.org/&response_type=code&scope=contact:read%20verification.basic:read%20verification.basic.details:read%20verification.liveness:read%20verification.liveness.details:read%20verification.uniq:read%20verification.uniq.details:read%20verification.wallet-near:read%20verification.wallet-near.details:read%20verification.wallet-near:read%20verification.wallet-near.details:read%20verification.idos:read%20verification.idos.details:read&user_role=person";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  gap: 32px;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font: var(--text-l);
  font-weight: 600;
  line-height: 30px;
  color: var(--sand12);
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${(p) => p.background ?? "var(--sand10)"};
  padding: 10px;
  position: relative;
`;

const Icon = styled.i`
  color: ${(p) => p.color ?? "var(--sand11)"};
  font-size: ${(p) => p.size ?? "20px"};
  ${(p) => p.fit && `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `}
`;

const IconSealUser = () => (
  <IconWrapper background="#f1eefe">
    <Icon className="ph-fill ph-seal" color="#7C66DC" size="28px" />
    <Icon className="ph-bold ph-user" color="var(--white)" size="14px" fit />
  </IconWrapper>
);

const IconSealCheck = () => (
  <IconWrapper background="#e5fbeb">
    <Icon className="ph-fill ph-seal-check" color="#3cb179" size="28px" />
  </IconWrapper>
);

const CredentialButton = ({ href, disabled, onClick }) => (
  <Widget
    src="${REPL_ACCOUNT}/widget/DIG.Button"
    props={{
      variant: "primary",
      label: "Add Credential",
      iconRight: "ph-bold ph-arrow-square-out",
      href,
      className: "ms-auto",
      disabled: disabled ?? !context.accountId,
      onClick,
    }}
  />
);

const verificationItems = [
  {
    id: "human",
    title: "Proof of personhood",
    text: "This verification helps other users know that you are not a bot. Choose from various providers to earn this verification badge.",
    icon: <IconSealUser />,
    verified: false,
    button: <CredentialButton onClick={() => Storage.set("fractal-alert", { alert: true, href: proofOfPersonhoodLink })} />,
  },
  {
    id: "plus",
    title: "Know Your Customer (KYC)",
    text: "This verification helps other users trust transactions with your account. Choose from various providers to earn this verification badge.",
    icon: <IconSealCheck />,
    verified: false,
    button: <CredentialButton onClick={() => Storage.set("fractal-alert", { alert: true, href: kycLink })} />,
  },
];


const verifiedItems =
  verificationItems
    .map((item) => idosCredentials && idosCredentials.find((cred) => cred.credential_type === item.id) ? { ...item, verified: true } : item)
    .filter((item) => !item.verified);

return (
  <Wrapper>
    <Widget
      src="${REPL_ACCOUNT}/widget/Settings.Identity.Verifications.List"
      props={{
        idosCredentials,
        verificationItems,
      }}
    />

    <Title>Verifications</Title>

    {verifiedItems.length === 0 ? (
      <Widget
        src="${REPL_ACCOUNT}/widget/Settings.Identity.Verifications.Card"
        props={{
          id: "complete",
          icon: <Icon className="ph ph-check" color="#3cb179" size="28px" />,
          text: "You have completed all verifications. No other credentials are available to add at this time.",
        }}
      />
    ) : (
      verifiedItems.map((item) => (
        <Widget
          src="${REPL_ACCOUNT}/widget/Settings.Identity.Verifications.Card"
          key={item.id}
          props={{
            icon: item.icon,
            title: item.title,
            text: item.text,
            button: item.button,
          }}
        />
      ))
    )}
  </Wrapper>
);

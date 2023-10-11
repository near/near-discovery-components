
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

let verificationItems = [
  {
    id: "personhood",
    title: "Proof of personhood",
    text: "This verification helps other users know that you are not a bot. Choose from various providers to earn this verification badge.",
    icon: <IconSealUser />,
    verified: false,
    button: <CredentialButton onClick={() => Storage.set("personhood-alert", true)} />,
  },
  {
    id: "kyc",
    title: "Know Your Customer (KYC)",
    text: "This verification helps other users trust transactions with your account. Choose from various providers to earn this verification badge.",
    icon: <IconSealCheck />,
    verified: false,
    button: <CredentialButton href="#" disabled />,
  },
];

verificationItems = verificationItems.filter((item) => !item.verified);


// useEffect(() => {
//   if (props.getUserInfo) {
//     const info = props.getUserInfo();
//     console.log("verifications | user info", info);
//   }
// }, [props.getUserInfo]);

// console.log("verifications | user info", info);

return (
  <Wrapper>
    <Title>Verifications</Title>

    {verificationItems.length === 0 ? (
      <Widget
        src="${REPL_ACCOUNT}/widget/Settings.Identity.Verifications.Card"
        props={{
          id: "complete",
          icon: <Icon className="ph ph-check" color="#3cb179" size="28px" />,
          text: "You have completed all verifications. No other credentials are available to add at this time.",
        }}
      />
    ) : (
      verificationItems.map((item) => (
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

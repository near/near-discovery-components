let { idosConnected, connectIdOS, walletImages, connectedWallet, idosCreateAccountUrl } = props;

const idOSLearnLink = "https://idos-1.gitbook.io/idos-docs";

const Wrapper = styled.div`
  display: grid;
  grid-gap: 24px;
  grid-template-columns: repeat(2, 320px);
  justify-content: center;
  margin: 0 auto;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow:
    0px 4px 4px 0px rgba(0, 0, 0, 0.1),
    0px -1px 2px 0px rgba(0, 0, 0, 0.15);
  border-radius: 15px;
  background: ${(p) => p.background};
  width: 100%;
  height: 100%;
  gap: 24px;
  padding: 24px;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  background: ${(p) => p.background};
  color: ${(p) => p.color};
  border-radius: 50%;
`;

const Title = styled.h4`
  font: var(--text-s);
  color: ${(p) => p.color};
  font-weight: 700;
`;

const ImagesWrapper = styled.div`
  display: flex;
  gap: 16px;
  flex: 1 0 auto;
`;

const WalletImageWrapper = styled.div`
  display: flex;
  width: 60px;
  height: 60px;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 50%;
  background: var(--white);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  opacity: ${(p) => (p.active ? "1" : "0.5")};
  transform: ${(p) => (p.active ? "scale(1.3)" : "scale(1)")};
  margin: auto 0;
`;

const WalletImage = styled.img`
  width: 55px;
  height: 55px;
  padding: 4px;
`;

const Checkmark = styled.i`
  position: absolute;
  top: -5px;
  right: -5px;
  display: block;
  background: var(--green8);
  border-radius: 50%;
  color: var(--white);
  font-size: 12px;
  padding: 4px;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Text = styled.span`
  font: var(--text-base);
  color: ${(p) => p.color};
`;

const TextLink = styled("Link")`
  color: var(--violet8);
  text-decoration: underline;
  font-weight: 700;
`;

const ImageWrapper = styled.div`
  padding: 0 24px;
`;

return (
  <Wrapper>
    <Card background="var(--white)">
      <Step background="var(--sand12)" color="var(--white)">
        1
      </Step>
      <Title>Log into idOS compatible wallet</Title>
      <ImagesWrapper>
        {walletImages &&
          walletImages.map((image) => (
            <WalletImageWrapper key={image.name} active={connectedWallet === image.name} title={image.name}>
              <WalletImage src={image.src} alt={image.name} />
              {connectedWallet === image.name && <Checkmark className="ph-bold ph-check" />}
            </WalletImageWrapper>
          ))}
      </ImagesWrapper>
      <Widget
        src="${REPL_ACCOUNT}/widget/DIG.Button"
        props={{
          variant: "primary",
          label: "Sign In",
          disabled: context.accountId,
          href: "/${REPL_ACCOUNT}/widget/Settings.Index?requestAuth=1",
        }}
      />
    </Card>

    <Card background="#0d0d0f">
      <Step background="var(--white)" color="var(--sand12)">
        2
      </Step>
      <Title color="var(--sand10)">Log into idOS</Title>
      <ImageWrapper>
        <Widget
          src="${REPL_MOB}/widget/Image"
          props={{
            image: {
              ipfs_cid: "bafkreigb7fwbwomsi2hg3to5tbapsnl43vfp6qdctnqhv5w4et7q5oqtnq",
            },
            alt: "log into idOS",
          }}
        />
      </ImageWrapper>
      <TextWrapper>
        <Text color="var(--sand10)">
          All your credentials and preferences on this settings page will be securely stored in a decentralized identity
          operating system (idOS). Sign in to view your data.
        </Text>
        <Text color="var(--sand10)">
          Learn more about idOS
          <TextLink href={idOSLearnLink} target="_blank">
            here
          </TextLink>
        </Text>
      </TextWrapper>
      <Widget
        src="${REPL_ACCOUNT}/widget/DIG.Button"
        props={{
          variant: "affirmative",
          label: "Sign In",
          disabled: !context.accountId || idosConnected,
          href: idosCreateAccountUrl,
        }}
      />
    </Card>
  </Wrapper>
);

let { idosConnected, connectIdOS } = props;

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

const Text = styled.span`
  font: var(--text-base);
  color: ${(p) => p.color};
`;

const TextLink = styled("Link")`
  color: var(--violet8);
  text-decoration: underline;
`;

const ImageWrapper = styled.div`
  padding: 0 24px;
`;

// https://ipfs.near.social/ipfs/bafkreigb7fwbwomsi2hg3to5tbapsnl43vfp6qdctnqhv5w4et7q5oqtnq

return (
  <Wrapper>
    <Card background="var(--white)">
      <Step background="var(--sand12)" color="var(--white)">
        1
      </Step>
      <Title>Log into idOS compatible wallet</Title>
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
      <Text color="var(--sand10)">
        All your credentials and preferences on this settings page will be securely stored in a decentralized identity
        operating system (idOS). To view your data, sign up or sign in.
        <br /> Learn more about idOS
        <TextLink href={idOSLearnLink} target="_blank">
          here
        </TextLink>
      </Text>
      {!idosConnected && (
        <Widget
          src="${REPL_ACCOUNT}/widget/DIG.Button"
          props={{
            variant: "affirmative",
            label: "Sign In",
            disabled: !context.accountId,
            onClick: connectIdOS,
          }}
        />
      )}
    </Card>
  </Wrapper>
);

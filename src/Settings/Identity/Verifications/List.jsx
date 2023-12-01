let { idosCredentials, verificationItems } = props;

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

const TableWrapper = styled.div`
  display: flex;
  padding: 16px 24px 24px 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  align-self: stretch;
  border-radius: 12px;
  border: 1px solid #eaecf0;
  background: #fff;
  box-shadow:
    0px 1px 2px 0px rgba(16, 24, 40, 0.06),
    0px 1px 3px 0px rgba(16, 24, 40, 0.1);
`;

const Table = styled.table`
  width: 100%;
`;

const Th = styled.th`
  font: var(--text-s);
  color: var(--sand11);
  font-weight: 400;
`;

const Td = styled.td`
  font: var(--text-s);
  color: ${(p) => (p.primary ? "var(--sand12)" : "var(--sand11)")};
  font-weight: 400;
  padding-top: 16px;
`;

const CredentialWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${(p) => p.background ?? "var(--sand10)"};
  padding: 5px;
  position: relative;
`;

const Icon = styled.i`
  color: ${(p) => p.color ?? "var(--sand11)"};
  font-size: ${(p) => p.size ?? "20px"};
  ${(p) =>
    p.fit &&
    `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `}
`;

const IconSealUser = () => (
  <IconWrapper background="#f1eefe">
    <Icon className="ph-fill ph-seal" color="#7C66DC" size="18px" />
    <Icon className="ph-bold ph-user" color="var(--white)" size="8px" fit />
  </IconWrapper>
);

const IconSealCheck = () => (
  <IconWrapper background="#e5fbeb">
    <Icon className="ph-fill ph-seal-check" color="#3cb179" size="18px" />
  </IconWrapper>
);

const iconType = (type) => {
  switch (type) {
    case "human":
      return {
        icon: <IconSealUser />,
        text: "Verified Human",
      };
    case "plus":
      return {
        icon: <IconSealCheck />,
        text: "KYC",
      };
    case "basic":
    default:
      return {
        icon: <i className="ph ph-user-circle" />,
        text: "Basic",
      };
  }
};

const CredentialType = ({ type }) => {
  const credentialInfo = iconType(type);
  return (
    <CredentialWrapper>
      {credentialInfo.icon}
      {credentialInfo.text}
    </CredentialWrapper>
  );
};

if (!idosCredentials || (idosCredentials && idosCredentials.length === 0)) return <></>;

return (
  <Wrapper>
    <Title>Saved Credentials</Title>

    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <Th>#</Th>
            <Th>Type</Th>
            <Th>Issuer</Th>
          </tr>
        </thead>
        <tbody>
          {idosCredentials.map((item, index) => (
            <tr key={item.id}>
              <Td primary>{index + 1}</Td>
              <Td primary>
                <CredentialType type={item.credential_type} />
              </Td>
              <Td>{item.issuer}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  </Wrapper>
);

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
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10);
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
  color: ${(p) => p.primary ? "var(--sand12)" : "var(--sand11)"};
  font-weight: 400;
  padding-top: 16px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const iconType = (type) => {
  switch (type) {
    case "human":
      return ({
        icon: <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M27.233 11.852c-.472-.492-.96-1-1.143-1.446-.17-.409-.18-1.086-.19-1.742-.019-1.22-.039-2.603-1-3.564-.961-.961-2.344-.981-3.564-1-.656-.01-1.333-.02-1.742-.19-.445-.184-.954-.671-1.447-1.143C17.286 1.94 16.306 1 15 1c-1.305 0-2.284.939-3.148 1.768-.492.47-1 .958-1.446 1.142-.406.17-1.086.18-1.742.19-1.22.019-2.603.039-3.564 1-.961.961-.975 2.344-1 3.564-.01.656-.02 1.334-.19 1.742-.184.445-.671.954-1.143 1.446C1.94 12.715 1 13.695 1 15c0 1.305.939 2.284 1.768 3.148.47.492.958 1 1.142 1.446.17.409.18 1.086.19 1.742.019 1.22.039 2.603 1 3.564.961.961 2.344.981 3.564 1 .656.01 1.334.02 1.742.19.445.184.954.671 1.446 1.143C12.715 28.06 13.695 29 15 29c1.305 0 2.284-.939 3.148-1.767.492-.472 1-.96 1.446-1.143.409-.17 1.086-.18 1.742-.19 1.22-.019 2.603-.039 3.564-1 .961-.961.981-2.344 1-3.564.01-.656.02-1.333.19-1.742.184-.445.671-.954 1.143-1.447C28.06 17.286 29 16.306 29 15c0-1.305-.939-2.284-1.767-3.148Z" fill="#fff"/><path d="m11.852 27.233-.346.36.049.047c.824.792 1.934 1.86 3.445 1.86 1.508 0 2.617-1.064 3.44-1.856l.054-.05.003-.004c.248-.237.484-.463.711-.653.233-.194.425-.322.576-.385h.002c.13-.054.338-.095.627-.119.283-.023.599-.028.93-.033l.076-.001c1.168-.018 2.73-.04 3.835-1.145 1.104-1.105 1.127-2.667 1.145-3.835v-.075c.006-.332.01-.648.034-.93.024-.29.065-.498.119-.628v-.001c.063-.152.191-.343.386-.576.19-.23.417-.467.656-.716l-.361-.345.36.346.047-.049c.792-.823 1.86-1.934 1.86-3.445 0-1.508-1.064-2.617-1.856-3.44a22.792 22.792 0 0 1-.05-.054l-.004-.003a14.658 14.658 0 0 1-.653-.711c-.194-.233-.322-.425-.385-.576v-.002c-.054-.13-.095-.338-.119-.627a14.382 14.382 0 0 1-.033-.93l-.001-.076c-.018-1.168-.04-2.73-1.145-3.835-1.105-1.104-2.667-1.127-3.835-1.145h-.075c-.332-.006-.648-.01-.93-.034-.29-.024-.498-.065-.628-.119h-.001c-.152-.063-.343-.191-.576-.385a14.74 14.74 0 0 1-.716-.657l-.345.361m-6.296 24.466-.345.36a14.69 14.69 0 0 0-.716-.655c-.233-.195-.424-.323-.576-.386-.13-.054-.339-.095-.628-.119a14.382 14.382 0 0 0-.93-.033l-.076-.001c-1.168-.018-2.73-.04-3.835-1.145-1.104-1.105-1.127-2.667-1.145-3.835v-.075c-.006-.332-.01-.648-.034-.93-.024-.29-.065-.498-.119-.628v-.002c-.063-.151-.191-.343-.385-.576-.19-.227-.416-.463-.653-.71l-.003-.004a31.546 31.546 0 0 0-.05-.053C1.564 17.617.5 16.508.5 15c0-1.51 1.068-2.621 1.86-3.445l.047-.049.36.346-.36-.345c.238-.25.465-.487.656-.716.194-.233.322-.424.385-.576.054-.13.095-.339.119-.628.023-.283.028-.599.033-.93v-.003l.002-.116c.023-1.159.053-2.7 1.144-3.792C5.851 3.642 7.413 3.62 8.581 3.601h.075c.332-.006.649-.01.932-.034.29-.024.497-.065.625-.118l.003-.001c.151-.063.343-.191.576-.385.227-.19.463-.416.71-.653l.004-.003.053-.05C12.383 1.564 13.492.5 15 .5c1.51 0 2.622 1.068 3.445 1.86l.049.047-.346.36m-6.296 24.466-.004-.005c-.49-.47-.998-.955-1.442-1.138h9.188c-.443.182-.946.664-1.435 1.132l-.011.01C17.284 28.063 16.305 29 15 29c-1.305 0-2.285-.939-3.148-1.767Zm6.296-24.466.004.005c.49.47.998.955 1.442 1.138h-9.188c.443-.182.946-.664 1.435-1.132l.011-.01C12.716 1.938 13.695 1 15 1c1.305 0 2.285.939 3.148 1.768Z" stroke="#fff"/><path d="M15.623 15.663c-.318.22-.692.337-1.075.337-.513 0-1.005-.21-1.368-.586A2.034 2.034 0 0 1 12.613 14c0-.396.113-.782.326-1.111a1.95 1.95 0 0 1 .868-.737 1.877 1.877 0 0 1 1.119-.113c.375.077.72.267.99.547.271.28.456.636.53 1.024.075.388.037.79-.11 1.155a1.987 1.987 0 0 1-.712.898Z" fill="#7C66DC"/><path d="m26.376 11.841.01.011c.802.864 1.71 1.843 1.71 3.148 0 1.305-.908 2.285-1.71 3.148l-.004.004c-.455.49-.924.998-1.101 1.442-.165.408-.174 1.083-.184 1.738v.01c-.018 1.218-.039 2.598-.968 3.558-.929.96-2.265.981-3.444 1h-.008c-.634.01-1.288.02-1.683.19-.429.182-.916.664-1.389 1.132l-.01.01c-.836.83-1.784 1.768-3.047 1.768-1.262 0-2.21-.939-3.046-1.767l-.004-.005c-.475-.47-.966-.955-1.395-1.138-.395-.17-1.049-.18-1.683-.19h-.008c-1.18-.019-2.515-.04-3.444-1-.93-.96-.95-2.34-.968-3.559v-.009c-.01-.655-.02-1.33-.184-1.738-.176-.443-.642-.946-1.095-1.435l-.01-.011C1.907 17.284 1 16.305 1 15c0-1.305.908-2.285 1.71-3.148l.011-.01c.453-.49.919-.993 1.095-1.436.164-.408.174-1.083.184-1.738v-.004l.001-.055c.024-1.207.05-2.562.967-3.509.929-.96 2.264-.981 3.444-1h.009c.634-.01 1.29-.02 1.682-.19.428-.182.915-.664 1.388-1.132l.011-.01C12.338 1.938 13.286 1 14.548 1c1.263 0 2.21.939 3.046 1.768l.011.01c.473.468.96.95 1.389 1.132.395.17 1.049.18 1.683.19h.008c1.18.019 2.515.04 3.444 1 .93.96.95 2.34.968 3.559v.009c.01.655.02 1.33.184 1.738.176.443.642.946 1.095 1.435Zm-7.124 8.667c.13-.228.168-.501.103-.758h.002a4.96 4.96 0 0 0-2.081-2.917 4.043 4.043 0 0 0 1.066-2.048 4.124 4.124 0 0 0-.216-2.315 3.976 3.976 0 0 0-1.426-1.799 3.783 3.783 0 0 0-2.153-.675c-.767 0-1.516.235-2.153.675a3.975 3.975 0 0 0-1.425 1.8 4.123 4.123 0 0 0-.217 2.314c.151.776.522 1.49 1.066 2.048a4.97 4.97 0 0 0-2.08 2.917 1.03 1.03 0 0 0 .104.758c.13.229.343.395.592.46a.94.94 0 0 0 .734-.106.997.997 0 0 0 .446-.612c.319-1.282 1.58-2.25 2.933-2.25 1.354 0 2.615.968 2.933 2.25a.997.997 0 0 0 .446.612.941.941 0 0 0 .734.107.972.972 0 0 0 .592-.46Z" fill="#7C66DC"/></svg>,
        text: "Verified Human"
      });
    case "kyc":
      return ({
        icon: <i className="ph-fill ph-seal-check" />,
        text: "KYC"
      });
    case "basic":
    default:
      return ({
        icon: <i className="ph ph-user-circle" />,
        text: "Basic"
      });
  }
};

const CredentialType = ({ type }) => {
  const credentialInfo = iconType(type);
  return (
    <IconWrapper>
      {credentialInfo.icon}
      {credentialInfo.text}
    </IconWrapper>
  );
};

if (!idosCredentials || (idosCredentials && idosCredentials.length === 0)) return<></>;

return (
  <Wrapper>
    <Title>Saved Credentials</Title>

    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <Th>#</Th>
            <Th>Type</Th>
            <Th>Shared with</Th>
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
              <Td>{item.original_id}</Td>
              <Td>{item.issuer}</Td>
            </tr>
          ))}
        </tbody>
      </Table>

    </TableWrapper>

  </Wrapper>
);

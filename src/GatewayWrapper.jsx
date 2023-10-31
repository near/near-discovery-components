let {
  targetComponent,
  targetProps,
  logOut,
  termsDomainName,
  privacyDomainName,
  recordToC
} = props;

termsDomainName = termsDomainName ?? "https://near.infura-ipfs.io/ipfs/QmaE4P6fn2VSTgAJ4gdEmAh7Ywiw9J3TT8aRjMaFLdoDPX";
privacyDomainName = privacyDomainName ?? "https://near.infura-ipfs.io/ipfs/QmRiu67GedetzBMwKMfJkrKnFNDSs8KSUDPKEgXKN2hVqU";

const tosName = props.tosName ?? "${REPL_ACCOUNT}/widget/TosContent";

return (
  <>
    <Widget
      key="wrapper-tos-check"
      src="${REPL_ACCOUNT}/widget/TosCheck"
      props={{
        logOut,
        termsDomainName,
        privacyDomainName,
        tosName,
        recordToC
      }}
    />

    <Widget key="wrapper-target" src={targetComponent} props={targetProps} />
  </>
);

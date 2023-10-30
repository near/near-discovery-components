let {
  targetComponent,
  targetProps,
  logOut,
  tosDomainName,
  termsCid,
  privacyCid,
  recordToC
} = props;

tosDomainName = tosDomainName ?? "https://near.infura-ipfs.io";
termsCid = termsCid ?? "QmaE4P6fn2VSTgAJ4gdEmAh7Ywiw9J3TT8aRjMaFLdoDPX";
privacyCid = privacyCid ?? "QmRiu67GedetzBMwKMfJkrKnFNDSs8KSUDPKEgXKN2hVqU";

const tosName = props.tosName ?? "${REPL_ACCOUNT}/widget/TosContent";

return (
  <>
    <Widget
      key="wrapper-tos-check"
      src="${REPL_ACCOUNT}/widget/TosCheck"
      props={{
        logOut,
        tosDomainName,
        termsCid,
        privacyCid,
        tosName,
        recordToC
      }}
    />

    <Widget key="wrapper-target" src={targetComponent} props={targetProps} />
  </>
);

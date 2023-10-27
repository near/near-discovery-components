const { targetComponent, targetProps, logOut, recordToC } = props;
const tosName = props.tosName ?? "${REPL_ACCOUNT}/widget/TosContent";

return (
  <>
    <Widget
      key="wrapper-tos-check"
      src="${REPL_ACCOUNT}/widget/TosCheck"
      props={{ logOut, tosName, recordToC }}
    />

    <Widget key="wrapper-target" src={targetComponent} props={targetProps} />
  </>
);

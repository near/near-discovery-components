let { idosConnected, ...forwardedProps } = props;

const activeTab = Storage.get("settings-tab") ?? "identity";
// tab names: account, content, news, identity, notifications

// Uncomment this when we have implement more then one tab.
const Wrapper = styled.div`
  // display: grid;
  // gap: 40px;
  // grid-template-columns: 264px minmax(0, 1fr);
  // align-items: start;
  // height: 100%;

  // @media (max-width: 1024px) {
  //   grid-template-columns: minmax(0, 1fr);
  // }
`;

const SettingsContent = () => {
  switch (activeTab) {
    case "account":
    case "content":
    case "news":
    case "notifications":
      return <div>Not implemented yet</div>;
    case "identity":
      default:
      return <Widget src="${REPL_ACCOUNT}/widget/Settings.Identity.Index" props={{ idosConnected, ...forwardedProps }} />;
  }
};

const handleMenuClick = (value) => {
  Storage.set("settings-tab", value);
};

// So far we have only implemented the identity tab. That's why we don't want to show Sidebar yet.
const Sidebar = () => (
  <Widget
    src="${REPL_ACCOUNT}/widget/Settings.Sidebar"
    props={{
      onClick: handleMenuClick,
      activeTab
    }}
  />
);

return (
  <Wrapper className="container-xl">
    <SettingsContent />
  </Wrapper>
);

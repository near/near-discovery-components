let { idOS, ...forwardedProps } = props;

const activeTab = Storage.get("settings-tab");
// tab names: account, content, news, identity, notifications

const Wrapper = styled.div`
  display: grid;
  gap: 40px;
  grid-template-columns: 264px minmax(0, 1fr);
  align-items: start;
  height: 100%;
`;

const renderContent = () => {
  switch (activeTab) {
    case "account":
    case "content":
    case "news":
    case "notifications":
      return <div>Not implemented yet</div>;
    case "identity":
      return <Widget src="${REPL_ACCOUNT}/widget/Settings.Identity.Index" props={{ ...forwardedProps }} />;
    default:
      return null;
  }
};

const handleMenuClick = (value) => {
  Storage.set("settings-tab", value);
};

return (
  <Wrapper className="container-xl">
    <Widget
      src="${REPL_ACCOUNT}/widget/Settings.Sidebar"
      props={{
        onClick: handleMenuClick,
        activeTab
      }}
    />
    {renderContent()}
  </Wrapper>
);

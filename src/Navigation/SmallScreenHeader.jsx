let { className, wrapperStyles, availableStorage, withdrawTokens, logOut } = props;

const Wrapper = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

return (
  <Wrapper className={className} style={{ ...wrapperStyles }}>
    <Widget
      src="${REPL_ACCOUNT}/widget/DIG.Button"
      props={{
        icon: "ph ph-magnifying-glass",
        variant: "secondary",
        style: { width: "40px", height: "40px" },
        href: "/${REPL_ACCOUNT}/widget/Search.IndexPage",
      }}
    />
    <Widget src="${REPL_ACCOUNT}/widget/NearOrg.Notifications.NotificationButton" props={{ mobileView }} />
    <Widget
      src="${REPL_ACCOUNT}/widget/Navigation.ProfileDropdown"
      props={{ availableStorage, withdrawTokens, logOut }}
    />
  </Wrapper>
);

let { className, wrapperStyles, availableStorage, withdrawTokens, logOut } = props;

const Wrapper = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  height: 100%;
`;

const Item = styled.div`
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
`;

return (
  <Wrapper className={className} style={{ ...wrapperStyles }}>
    <Item>
      <Widget
        src="${REPL_ACCOUNT}/widget/DIG.Button"
        props={{
          icon: "ph ph-magnifying-glass",
          variant: "secondary",
          style: { width: "40px", height: "40px" },
          href: "/${REPL_ACCOUNT}/widget/Search.IndexPage",
        }}
      />
    </Item>
    <Item>
      <Widget
        src="${REPL_ACCOUNT}/widget/NearOrg.Notifications.NotificationButton"
        props={{ size: "40px", mobileView: true }}
      />
    </Item>
    <Item>
      <Widget
        src="${REPL_ACCOUNT}/widget/Navigation.ProfileDropdown"
        props={{ availableStorage, withdrawTokens, logOut }}
      />
    </Item>
  </Wrapper>
);

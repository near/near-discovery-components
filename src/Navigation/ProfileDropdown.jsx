let { accountId, profile, availableStorage, withdrawTokens, logOut, noProfileName } = props;

accountId = accountId ?? context.accountId;
profile = profile ?? Social.get(`${accountId}/profile/**`, "final");

const profilePage = `/${REPL_ACCOUNT}/widget/ProfilePage?accountId=${accountId}`;

const Text = styled.span`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  font-size: 14px;
  overflow: ${(p) => (p.$ellipsis ? "hidden" : "")};
  text-overflow: ${(p) => (p.$ellipsis ? "ellipsis" : "")};
  white-space: ${(p) => (p.$ellipsis ? "nowrap" : "")};
`;
const Flex = styled.div`
  display: flex;
  gap: ${(p) => p.$gap};
  align-items: ${(p) => p.$alignItems};
  justify-content: ${(p) => p.$justifyContent};
  flex-direction: ${(p) => p.$direction ?? "row"};
  flex-wrap: ${(p) => p.$wrap ?? "nowrap"};

  @media (max-width: 576px) {
    gap: 10px;
  }
`;

const handleWithdraw = () => {
  if (withdrawTokens) {
    withdrawTokens();
  } else {
    console.log("withdrawTokens function not provided");
  }
};

const handleLogOut = () => {
  if (logOut) {
    logOut();
  } else {
    console.log("logOut function not provided");
  }
};

const menuItems = [
  {
    name: "Profile",
    iconLeft: "ph-duotone ph-user",
    href: profilePage,
  },
  {
    name: "Settings",
    iconLeft: "ph-duotone ph-gear",
    href: "/settings",
  },
  {
    name: `Withdraw ${availableStorage ?? 0}kb`,
    iconLeft: "ph-duotone ph-bank",
    onSelect: handleWithdraw,
    disabled: !availableStorage,
  },
  {
    name: "Log out",
    iconLeft: "ph-duotone ph-sign-out",
    onSelect: handleLogOut,
  },
];

return (
  <Widget
    src="${REPL_ACCOUNT}/widget/DIG.DropdownMenu"
    props={{
      trigger: (
        <Flex $gap="8px" $alignItems="center">
          <Widget
            src="${REPL_ACCOUNT}/widget/DIG.Avatar"
            props={{
              alt: accountId,
              image: profile.image,
              style: { width: "40px", height: "40px" },
            }}
          />
          {!noProfileName && (
            <Text $ellipsis className="profile-dropdown-name">
              {profile.name || accountId.split(".near")[0]}
            </Text>
          )}
        </Flex>
      ),
      items: menuItems,
    }}
  />
);

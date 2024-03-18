let { accountId, profile, availableStorage, withdrawTokens, logOut } = props;

accountId = accountId ?? context.accountId;
profile = profile ?? Social.get(`${accountId}/profile/**`, "final");

const profilePage = `/${REPL_ACCOUNT}/widget/ProfilePage?accountId=${accountId}`;

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
        <Widget
          src="${REPL_ACCOUNT}/widget/DIG.Avatar"
          props={{
            alt: accountId,
            image: profile.image,
            style: { width: "40px", height: "40px" },
          }}
        />
      ),
      items: menuItems,
    }}
  />
);

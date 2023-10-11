let { onClick, activeTab } = props;

activeTab = activeTab ?? "identity";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-right: 1px solid #eceef0;
  gap: 24px;
  width: 264px;
  height: 100%;
`;

const Title = styled.h2`
  font: var(text-l);
  font-weight: 600;
  padding: 64px 24px 24px;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: 0.2s all;
  font-weight: 400;

  ${(p) => p.active && `
    font-weight: 700;
  `}
`;

const Text = styled.span`
  font: var(--text-s);
  font-weight: inherit;
  line-height: 16px;
`;

const Icon = styled.i`
  font-size: 24px;
`;

const menuItems = [
  {
    id: "account",
    icon: "ph-bold ph-users",
    label: "Account preferences",
  },
  {
    id: "content",
    icon: "ph-bold ph-book-open",
    label: "Content preferences",
  },
  {
    id: "news",
    icon: "ph-bold ph-newspaper",
    label: "News feed",
  },
  {
    id: "identity",
    icon: "ph-bold ph-shield-check",
    label: "Identity & data privacy",
  },
  {
    id: "notifications",
    icon: "ph-bold ph-bell",
    label: "Notifications",
  },
];

return (
  <Wrapper>
    <Title>Settings</Title>

    {menuItems.map((item) => (
      <MenuItem
        key={`settings-${item.id}`}
        onClick={() => onClick(item.id)}
        active={activeTab === item.id}
      >
        <Icon className={item.icon} />
        <Text>{item.label}</Text>
      </MenuItem>
    ))}
  </Wrapper>
);

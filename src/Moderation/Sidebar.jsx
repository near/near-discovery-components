const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-right: 1px solid #eceef0;
  gap: 24px;
  width: 240px;
  height: 100%;
`;

const Title = styled.h2`
  font: var(text-l);
  font-weight: 600;
`;

const MenuItem = styled.button`
  all: unset;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: 0.2s all;
  font-weight: 400;
  ${(p) =>
    p.active && 
      `color: var(--violet11);
       font-weight: 700;`
  }
  ${(p) =>
    p.disabled &&
  `color: var(--sand8);
   pointer-events: none;`
  }
`;

const Text = styled.span`
  font: var(--text-s);
  font-weight: inherit;
  line-height: 16px;
`;

const Icon = styled.i`
  font-size: 24px;
`;

let { activeTab } = props;
const menuItems = props.items || [
  {
    value: "a",
    icon: "ph-bold ph-users",
    label: "Menu Item A",
  },
  {
    value: "b",
    icon: "ph-bold ph-users",
    label: "Menu Item B",
  },
];
return (
  <Wrapper>
    <Title>{props.title || ""}</Title>

    {menuItems.map((item) => (
      <MenuItem
        key={`sidebar-${item.value}`}
        onClick={() => item.onSelect(item.value)}
        active={activeTab === item.value}
        disabled={item.disabled}
      >
        <Icon className={item.icon} />
        <Text>{item.name}</Text>
      </MenuItem>
    ))}
  </Wrapper>
);

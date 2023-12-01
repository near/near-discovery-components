let { trigger, header, subHeader, items, ...rootProps } = props;

const Root = styled("DropdownMenu.Root")``;

const TriggerWrapper = styled.span`
  display: inline-block;
`;

const Content = styled("DropdownMenu.Content")`
  min-width: 220px;
  background-color: white;
  border-radius: 6px;
  padding: 2px 0;
  box-shadow:
    0px 4px 8px 0px var(--blackA3),
    0px 0px 0px 1px var(--blackA3);
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;

  &[data-side="bottom"] {
    animation-name: slideUpAndFade;
  }

  @keyframes slideUpAndFade {
    from {
      opacity: 0;
      transform: translateY(2px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  a {
    all: unset;
  }
`;

const MenuItem = styled("DropdownMenu.Item")`
  font: var(--text-s);
  color: var(--sand12);
  border-radius: 4px;
  display: flex;
  align-items: center;
  height: 36px;
  padding: 8px 12px;
  margin: 2px 4px;
  position: relative;
  user-select: none;
  outline: none;
  cursor: pointer;
  gap: 8px;

  &[data-highlighted] {
    background-color: var(--sand3);
    color: var(--sand12);
  }

  &[data-disabled] {
    pointer-events: none;
    color: var(--sand11);
  }

  a {
    all: unset;
    cursor: inherit;
  }
`;

const SubMenu = styled("DropdownMenu.Sub")``;

const SubMenuTrigger = styled("DropdownMenu.SubTrigger")`
  font: var(--text-s);
  color: var(--sand12);
  border-radius: 4px;
  display: flex;
  align-items: center;
  height: 36px;
  padding: 8px 12px;
  margin: 4px;
  position: relative;
  user-select: none;
  outline: none;
  gap: 8px;
  cursor: pointer;

  &[data-state="open"] {
    background-color: var(--sand4);
    color: var(--sand12);
  }

  &[data-highlighted] {
    background-color: var(--sand3);
    color: var(--sand12);
  }

  &[data-disabled] {
    pointer-events: none;
    color: var(--sand11);
  }
`;

const SubMenuContent = styled("DropdownMenu.SubContent")`
  min-width: 220px;
  background-color: white;
  border-radius: 6px;
  padding: 4px 0;
  box-shadow:
    0px 4px 8px 0px var(--blackA3),
    0px 0px 0px 1px var(--blackA3);
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;

  &[data-side="right"] {
    animation-name: slideLeftAndFade;
  }

  @keyframes slideLeftAndFade {
    from {
      opacity: 0;
      transform: translateX(2px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const Label = styled("DropdownMenu.Label")`
  font: ${(p) => (p.subHeader ? "var(--text-xs)" : "var(--text-s)")};
  padding: 12px 16px;
  font-weight: 600;
  border-bottom: ${(p) => (!p.subHeader ? "1px solid var(--sand4)" : "none")};
  margin-bottom: 4px;
`;

const IconLeft = styled.i`
  color: var(--sand10);

  ${MenuItem}[data-highlighted] & {
    color: var(--violet10);
  }
  ${MenuItem}[data-disabled] & {
    color: var(--sand8);
  }

  ${SubMenuTrigger}[data-highlighted] & {
    color: var(--violet10);
  }

  ${SubMenuTrigger}[data-state='open'] & {
    color: var(--violet10);
  }

  ${SubMenuTrigger}[data-disabled] & {
    color: var(--sand8);
  }
`;

const IconRight = styled.i`
  margin-left: auto;
  color: var(--sand10);

  ${MenuItem}[data-highlighted] & {
    color: var(--violet10);
  }

  ${MenuItem}[data-disabled] & {
    color: var(--sand8);
  }

  ${SubMenuTrigger}[data-highlighted] & {
    color: var(--violet10);
  }

  ${SubMenuTrigger}[data-state='open'] & {
    color: var(--violet10);
  }

  ${SubMenuTrigger}[data-disabled] & {
    color: var(--sand8);
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: var(--sand4);
`;

const DropdownItem = (props) => (
  <MenuItem onSelect={props.onSelect} disabled={props.disabled}>
    {props?.iconLeft && <IconLeft className={props.iconLeft} />}
    {props.name}
    {props?.iconRight && <IconRight className={props.iconRight} />}
  </MenuItem>
);

const DropdownItems = (menu, isSection, noDivider) => (
  <>
    {menu?.header && <Label subHeader={isSection}>{menu?.header}</Label>}
    {menu?.items &&
      menu.items.length > 0 &&
      menu.items.map((item, index) =>
        item.subMenuProps ? (
          <>
            {item.subHeader && <Label subHeader>{item.subHeader}</Label>}
            <SubMenu>
              <SubMenuTrigger disabled={item.disabled}>
                {item?.iconLeft && <IconLeft className={item.iconLeft} />}
                {item.name}
                <IconRight className="ph ph-caret-right" />
              </SubMenuTrigger>
              <SubMenuContent sideOffset={2} alignOffset={-5}>
                <DropdownItems {...item.subMenuProps} />
              </SubMenuContent>
            </SubMenu>
          </>
        ) : item.asSection ? (
          <DropdownItems
            {...item}
            isSection={true}
            noDivider={item.noDivider}
          />
        ) : (
          <>
            {item.subHeader && <Label subHeader>{item.subHeader}</Label>}
            {item.href ? (
              <Link href={item.href.toString()} target={item?.target}>
                <DropdownItem {...item} />
              </Link>
            ) : (
              <DropdownItem {...item} />
            )}
            {isSection && !noDivider && menu?.items?.length === index + 1 && (
              <Divider />
            )}
          </>
        ),
      )}
  </>
);

trigger = trigger ?? (
  <Widget
    src="${REPL_ACCOUNT}/widget/DIG.Chip"
    props={{
      label: "Trigger",
      iconRight: "ph ph-caret-down",
    }}
  />
);

const previewProps = {
  header: "Dropdown header",
  items: [
    {
      name: "Profile",
      iconLeft: "ph ph-user-circle",
      iconRight: "ph ph-user-focus",
    },
    {
      subHeader: "Sub header here",
      name: "Settings",
    },
    {
      name: "Groups",
      iconLeft: "ph ph-user-circle",
      subMenuProps: {
        items: [
          {
            header: "Section header without divider",
            asSection: true,
            noDivider: true,
            items: [
              {
                name: "Section name 1",
              },
              {
                name: "Section name 2",
              },
            ],
          },
          {
            name: "Nested Profile",
            iconLeft: "ph ph-user-circle",
            iconRight: "ph ph-user-focus",
          },
          {
            name: "Nested Groups Nested Groups",
            subMenuProps: {
              header: "My double nested Account",
              items: [
                {
                  name: "Menu item as link",
                  href: "near.org",
                  target: "_blank",
                  iconRight: "ph ph-link",
                },
                {
                  header: "Section header 2",
                  asSection: true,
                  items: [
                    {
                      name: "Section name 1",
                    },
                    {
                      name: "Section name 2",
                    },
                  ],
                },
                {
                  header: "Section header 3",
                  asSection: true,
                  items: [
                    {
                      name: "Section name 1",
                    },
                  ],
                },
                {
                  name: "Double Nested Groups",
                },
                {
                  name: "Double Nested Settings",
                },
              ],
            },
          },
          {
            name: "Nested Settings",
          },
        ],
      },
    },
  ],
};

items = items?.length > 0 ? items : previewProps.items;

return (
  <DropdownMenu.Root {...rootProps}>
    <DropdownMenu.Trigger asChild>
      <TriggerWrapper>{trigger}</TriggerWrapper>
    </DropdownMenu.Trigger>
    <Content sideOffset={20} alignOffset={20}>
      <DropdownItems {...{ trigger, header, subHeader, items }} />
    </Content>
  </DropdownMenu.Root>
);

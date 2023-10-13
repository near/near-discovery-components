const handleClick = () => {
  State.update({ clicked: true });
};

State.init({
  clicked: false,
});

const CenteredLinksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TextLink = styled.a`
  display: block;
  margin: 0;
  font-size: 14px;
  line-height: 18px;
  color: ${(p) => (p.bold ? "#11181C !important" : "#687076 !important")};
  font-weight: ${(p) => (p.bold ? "600" : "400")};
  font-size: ${(p) => (p.small ? "12px" : "14px")};
  overflow: ${(p) => (p.ellipsis ? "hidden" : "visible")};
  text-overflow: ${(p) => (p.ellipsis ? "ellipsis" : "unset")};
  white-space: nowrap;
  outline: none;
  max-width: 230px;

  &:focus,
  &:hover {
    text-decoration: underline;
  }
`;

return (
  <div onClick={handleClick}>
    <Widget
      src="${REPL_ACCOUNT}/widget/Recommender.Service.EngagementTracker"
      props={{
        accountId: props.accountId,
        accountIdRank: props.accountIdRank,
        fromContext: props.fromContext,
        event: "Profile Interest | Clicked on Profile Name",
        onClick: state.clicked,
      }}
    />
    <CenteredLinksWrapper>
      <TextLink href={props.profileUrl} ellipsis bold>
        {props.profileName}
      </TextLink>
      <TextLink href={props.profileUrl} ellipsis>
        @{props.accountId}
      </TextLink>
    </CenteredLinksWrapper>
  </div>
);

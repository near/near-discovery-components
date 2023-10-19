const customWidgets = context.accountId
  ? Social.get(`${context.accountId}/settings/near.social/homepage.rhs`)
  : undefined;

if (customWidgets === null) {
  return "";
}

const defaultWidgets = [
  {
    src: "${REPL_NEARWEEK}/widget/NEARWEEKNews",
  },
  {
    src: "${REPL_NEARWEEK}/widget/nearweek-newsletter",
  },
  {
    src: "${REPL_ACCOUNT}/widget/LatestPeople",
  },
  {
    src: "${REPL_ACCOUNT}/widget/LatestFollowActivity",
  },
  {
    src: "${REPL_ACCOUNT}/widget/RootIconLinks",
  },
];

const widgets = (customWidgets && JSON.parse(customWidgets)) ?? defaultWidgets;

const Section = styled.div`
  border-bottom: 1px solid #eceef0;
  padding-bottom: 25px;
  margin-bottom: 25px;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }
`;

const ButtonLink = styled.a`
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 8px;
  height: 32px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  cursor: pointer;
  border: 1px solid #d7dbdf;
  background: #fbfcfd;
  color: #11181c !important;

  &:hover,
  &:focus {
    background: #ecedee;
    text-decoration: none;
    outline: none;
  }
`;

return (
  <>
    {widgets.map(
      ({ src, requiresLogin }, i) =>
        (!requiresLogin || context.accountId) && (
          <Section key={i}>
            <Widget src={src} />
          </Section>
        )
    )}

    <Section>
      {context.accountId && (
        <ButtonLink
          key="edit"
          href={"#/${REPL_MOB_2}/widget/Welcome.RHS.Editor"}
        >
          <i className="bi bi-list" /> Edit Widgets
        </ButtonLink>
      )}
    </Section>
  </>
);

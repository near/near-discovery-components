if (!props.formUrl) return "Missing prop: formUrl";

const title = props.title ?? "Coming Soon";
const description = props.description ?? "Want to start using the fastest way to onboard in Web3?";

const StyledMainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--sand3);
  border-radius: 8px;
  padding: 16px;
  position: relative;
  text-align: center;
  text-align: left;

  > h3 {
    font: var(--text-l);
    font-weight: 600;
    color: var(--sand12);
    margin: 0;
  }

  > p {
    font: var(--text-base);
    color: var(--sand10);
    margin: 0;
  }
`;

return (
  <StyledMainContent>
    <h3>{title}</h3>
    <p>{description}</p>
    <Widget
      src="${REPL_ACCOUNT}/widget/DIG.Button"
      props={{
        label: "Register for Early Access",
        variant: "affirmative",
        href: props.formUrl,
        target: "_blank",
      }}
    />
  </StyledMainContent>
);

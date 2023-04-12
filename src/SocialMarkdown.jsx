const Wrapper = styled.div`
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: #11181c;
  word-break: break-word;

  > * {
    margin-bottom: 12px;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 600;
    font-size: 14px;
    line-height: 1.4em;
    color: #11181c;
  }

  h1 {
    font-size: 19px;
  }
  h2 {
    font-size: 16px;
  }

  p {
    white-space: pre-line;
  }

  a {
    color: #006adc;
    outline: none;
    font-weight: 600;

    &:hover,
    &:focus {
      color: #006adc;
      text-decoration: underline;
    }
  }

  img {
    display: block;
    max-width: 100%;
    max-height: 80vh;
  }
`;

const renderMention =
  props.renderMention ??
  ((accountId) => (
    <Widget
      key={accountId}
      src="near/widget/AccountProfileInline"
      props={{
        accountId,
        hideAvatar: true,
      }}
    />
  ));

return (
  <Wrapper>
    <Markdown text={props.text} onMention={renderMention} />
  </Wrapper>
);

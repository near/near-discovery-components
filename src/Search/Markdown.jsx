const Wrapper = styled.div`
  color: #606D7A !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  line-height: 20 !important;
  text-align: left !important;
  margin: 0 !important;
  padding: 0 !important;
  /* add the remaining properties */
  color: #606d7a;
  word-break: break-word;
  justify-content: center;
  height: 100%;
  width: 100%;
  overflow: hidden;

  > * {
    margin-bottom: 12px;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 400;
    font-size: 12px;
    line-height: 1.4em;
    color: #606D7A;
  }

  h1 {
    font-size: 12px;
  }
  h2 {
    font-size: 12px;
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

  b {
    font-weight: 700;
    text-decoration: underline;

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

const word = () => {};

return (
  <Wrapper style={{ fontSize: "12px", color:'#606D7A'}}>
    <Markdown  text={props.text} onMention={renderMention} />
  </Wrapper>
);

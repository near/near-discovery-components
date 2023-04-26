const Wrapper = styled.div`
  font-size: 12px;
  line-height: 20px;
  font-weight: 400;
  color: #606d7a;
  text-align: left;
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
    font-weight: 400;
    font-size: 12px;
    line-height: 1.4em;
    color: #606d7a;
  }

  h1,
  h2 {
    font-size: 12px;
  }

  p {
    white-space: pre-line;
  }

  a {
    color: #606d7a;
    outline: none;
    font-weight: 400;

    &:hover,
    &:focus {
      color: #606d7a;
      text-decoration: none;
    }
  }

  img {
    display: block;
    max-width: 100%;
    max-height: 80vh;
  }
`;

return (
  <Wrapper>
    <Markdown text={props.text} />
  </Wrapper>
);

let { minHeight, style, ...forwardedProps } = props;

return (
  <Widget
    src="${REPL_ACCOUNT}/widget/DIG.Input"
    props={{
      style: {
        minHeight,
        ...style,
      },
      textarea: true,
      ...forwardedProps,
    }}
  />
);

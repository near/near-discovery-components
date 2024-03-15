return (
  <Widget
    src={"${REPL_ACCOUNT}/widget/Navigation.LargeScreenNav"}
    props={{
      title: "Home",
      children: (
        <>
          <Widget src="${REPL_ACCOUNT}/widget/Navigation.Search" />

          <div>Hello</div>
        </>
      ),
    }}
  />
);

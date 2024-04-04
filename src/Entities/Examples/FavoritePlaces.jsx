// This is an example of how to use the Entity components
// It is the simplest example, using the GenericEntityConfig widget and no additional fields
return (
  <div className="gateway-page-container">
    <Widget
      src="${REPL_ACCOUNT}/widget/Entities.Template.GenericEntityConfig"
      props={{ namespace: "examples", entityType: "favoritePlace" }}
    />
  </div>
);

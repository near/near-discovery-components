// This is an example of how to use the Entity components
// It uses a custom schema to specify additional fields
return (
  <div className="gateway-page-container">
    <p>A custom message</p>
    <Widget
      src="${REPL_ACCOUNT}/widget/Entities.Template.GenericEntityConfig"
      props={{
        namespace: "examples",
        entityType: "favoriteCar",
        schemaFile: "${REPL_ACCOUNT}/widget/Entities.Examples.FavoriteCarSchema",
        //todo defaultImage: "some car photo",
      }}
    />
  </div>
);

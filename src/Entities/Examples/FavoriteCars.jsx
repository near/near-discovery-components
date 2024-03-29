return (
  <div className="gateway-page-container">
    <p>A custom message</p>
    <Widget
      src="${REPL_ACCOUNT}/widget/Entities.Template.GenericEntityConfig"
      props={{
        namespace: "examples",
        entityType: "favoriteCar",
        title: "Favorite Car",
        schemaFile: "${REPL_ACCOUNT}/widget/Entities.Examples.FavoriteCarSchema",
        //todo defaultImage: "some car photo",
      }}
    />
  </div>
);

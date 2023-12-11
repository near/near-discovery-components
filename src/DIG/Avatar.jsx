let { alt, image, size, ...forwardedProps } = props;

alt = alt ?? "User avatar";
size = size ?? "small";

function returnSize() {
  switch (size) {
    case "medium":
      return "38px";
    case "small":
      return "28px";
  }

  return size;
}

const Avatar = styled.div`
  width: ${returnSize()};
  height: ${returnSize()};
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 100%;

  img {
    border: none;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

return (
  <Avatar {...forwardedProps}>
    <Widget
      src="${REPL_MOB}/widget/Image"
      props={{
        image,
        alt,
        fallbackUrl: "https://ipfs.near.social/ipfs/bafkreibiyqabm3kl24gcb2oegb7pmwdi6wwrpui62iwb44l7uomnn3lhbi",
      }}
    />
  </Avatar>
);

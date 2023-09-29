const appUrl = `#/${props.author}/widget/${props.widgetName}`;

const Thumbnail = styled.a`
  display: block;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 1.25rem;
  border: 1px solid var(--sand6);
  background: #fff;
  position: relative;
  cursor: pointer;
  text-decoration: none !important;
  outline: none;
  transition: all 200ms;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: none;
  }

  &:hover,
  &:focus {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.15);
  }
`;

const ThumbnailContent = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.25rem;
  padding-top: 3.5rem;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.85) 20%,
    rgba(0, 0, 0, 0)
  );
  font: var(--text-xs);
  color: var(--white);
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.75);

  b {
    font-weight: 600;
  }

  @media (max-width: 650px) {
    padding: 0.75rem;
  }
`;

const ThumbnailTag = styled.span`
  display: inline-flex;
  border-bottom-right-radius: 1.25rem;
  background: var(--violet7);
  color: #fff;
  font: var(--text-xs);
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  position: absolute;
  top: 0;
  left: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
`;

return (
  <Thumbnail href={appUrl}>
    <Widget
      src="${REPL_MOB}/widget/Image"
      props={{
        image: props.image,
        fallbackUrl:
          "https://ipfs.near.social/ipfs/bafkreifc4burlk35hxom3klq4mysmslfirj7slueenbj7ddwg7pc6ixomu",
        alt: props.widgetName,
      }}
    />

    <ThumbnailContent>
      <span>
        <b>{props.name ?? props.widgetName}</b>
      </span>
      <span>{props.author}</span>
    </ThumbnailContent>
  </Thumbnail>
);

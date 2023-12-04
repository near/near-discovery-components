const Text = styled.p`
  font: var(--${(p) => p.size ?? "text-base"});
  font-weight: ${(p) => p.fontWeight};
  color: var(--${(p) => p.color ?? "sand12"});
  margin: 0;
`;

const ArticleImage = styled.div`
  width: 100%;
  aspect-ratio: 26 / 15;
  border-radius: 1rem;
  border: 1px solid var(--sand6);
  overflow: hidden;
  transition: all 200ms;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: none;
  }
`;

const ArticleContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Article = styled("Link")`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: row;
  cursor: pointer;
  text-decoration: none !important;

  &:hover,
  &:focus {
    ${ArticleImage} {
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.15);
    }
  }
`;

return (
  <Article url={props.url}>
    <ArticleImage>
      <Widget
        src="${REPL_MOB}/widget/Image"
        props={{
          image: props.image,
          fallbackUrl: "https://ipfs.near.social/ipfs/bafkreifc4burlk35hxom3klq4mysmslfirj7slueenbj7ddwg7pc6ixomu",
          alt: props.title,
        }}
      />
    </ArticleImage>

    <ArticleContent>
      <Text size="text-base" fontWeight={600}>
        {props.title}
      </Text>
      <Text size="text-xs">{props.author}</Text>
    </ArticleContent>
  </Article>
);

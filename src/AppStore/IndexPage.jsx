const Wrapper = styled.div`
  padding: 100px 0;
  background: url("https://ipfs.near.social/ipfs/bafkreie5t75jirebnuyozmsc5hxzhxpoqivaxmc4rypaaogab6qh7asb2i");
  background-position: right top;
  background-size: 1440px auto;
  background-repeat: no-repeat;
`;

const Container = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 16px;
`;

const Section = styled.div`
  margin-top: 3rem;
`;

const H1 = styled.h1`
  font: var(--text-hero);
  color: var(--sand12);
  margin: 0 0 3rem;
`;

const H2 = styled.h2`
  font: var(--text-l);
  color: var(--sand12);
  margin: 0 0 1.5rem;
  font-weight: 600;
`;

const Text = styled.p`
  font: var(--${(p) => p.size ?? "text-base"});
  font-weight: ${(p) => p.fontWeight};
  color: var(--${(p) => p.color ?? "sand12"});
  margin: 0;
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 1.5rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
`;

const OverlayCard = styled.a`
  display: block;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 1.25rem;
  border: 1px solid var(--sand6);
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

const OverlayCardContent = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.25rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
  font: var(--text-xs);
  color: var(--white);

  b {
    font-weight: 600;
  }
`;

const OverlayCardTag = styled.span`
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

const AppImage = styled.div`
  width: 5rem;
  height: 5rem;
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

const AppContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const App = styled.a`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  cursor: pointer;
  text-decoration: none !important;

  &:hover,
  &:focus {
    ${AppImage} {
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.15);
    }
  }
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

const Article = styled.a`
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
  <Wrapper>
    <Container>
      <H1>d.Apps</H1>

      <Section>
        <ThumbnailGrid>
          <OverlayCard href="/">
            <OverlayCardTag>Featured</OverlayCardTag>
            <img src="https://images.unsplash.com/photo-1691250993170-4c9919194aa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3794&q=80" />
            <OverlayCardContent>
              <span>
                <b>App Name</b>
              </span>
              <span>Creator</span>
            </OverlayCardContent>
          </OverlayCard>

          <OverlayCard>
            <OverlayCardTag>Featured</OverlayCardTag>
            <img src="https://images.unsplash.com/photo-1691250993170-4c9919194aa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3794&q=80" />
            <OverlayCardContent>
              <span>
                <b>App Name</b>
              </span>
              <span>Creator</span>
            </OverlayCardContent>
          </OverlayCard>

          <OverlayCard>
            <img src="https://images.unsplash.com/photo-1691250993170-4c9919194aa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3794&q=80" />
            <OverlayCardContent>
              <span>
                <b>App Name</b>
              </span>
              <span>Creator</span>
            </OverlayCardContent>
          </OverlayCard>

          <OverlayCard>
            <img src="https://images.unsplash.com/photo-1691250993170-4c9919194aa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3794&q=80" />
            <OverlayCardContent>
              <span>
                <b>App Name</b>
              </span>
              <span>Creator</span>
            </OverlayCardContent>
          </OverlayCard>
        </ThumbnailGrid>
      </Section>

      <Section>
        <H2>Subheader</H2>

        <ContentGrid>
          <App>
            <AppImage>
              <img src="https://images.unsplash.com/photo-1691250993170-4c9919194aa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3794&q=80" />
            </AppImage>
            <AppContent>
              <Text size="text-s" fontWeight={600}>
                App Name
              </Text>
              <Text size="text-xs">Creator</Text>
            </AppContent>
          </App>
          <App>
            <AppImage>
              <img src="https://images.unsplash.com/photo-1691250993170-4c9919194aa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3794&q=80" />
            </AppImage>
            <AppContent>
              <Text size="text-s" fontWeight={600}>
                App Name
              </Text>
              <Text size="text-xs">Creator</Text>
            </AppContent>
          </App>
        </ContentGrid>
      </Section>

      <Section>
        <H2>Subheader</H2>

        <ContentGrid>
          <Article>
            <ArticleImage>
              <img src="https://images.unsplash.com/photo-1691250993170-4c9919194aa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3794&q=80" />
            </ArticleImage>
            <ArticleContent>
              <Text size="text-base" fontWeight={600}>
                Article Name
              </Text>
              <Text size="text-xs">Creator</Text>
            </ArticleContent>
          </Article>
          <Article>
            <ArticleImage>
              <img src="https://images.unsplash.com/photo-1691250993170-4c9919194aa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3794&q=80" />
            </ArticleImage>
            <ArticleContent>
              <Text size="text-base" fontWeight={600}>
                Article Name
              </Text>
              <Text size="text-xs">Creator</Text>
            </ArticleContent>
          </Article>
        </ContentGrid>
      </Section>
    </Container>
  </Wrapper>
);

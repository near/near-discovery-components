let { open, onOpenChange } = props;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const ImageWrapper = styled.div`
  margin-top: -24px;
`;

const Title = styled.span`
  font: var(--text-xl);
  color: var(--black);
  font-weight: 700;
  margin-top: 32px;
`;

const Text = styled.span`
  font: var(--text-base);
  color: ${(p) => p.color ?? "var(--sand11)"};
  font-weight: ${(p) => p.fontWeight ?? "450"};
  letter-spacing: 0.32px;
  text-align: center;
  line-height: 24px;
`;

const Icon = styled.i`
  color: var(--violet8);
  font-size: 20px;
`;

const Content = () => (
  <ContentWrapper>
    <ImageWrapper>
      <Widget
        src="${REPL_MOB}/widget/Image"
        props={{
          image: {
            ipfs_cid:
              "bafkreihz4e7buokkwptg5mnlsy56huj447xauzueclplqgv574tr7i2hki",
          },
          alt: "add near to home screen",
        }}
      />
    </ImageWrapper>
    <Title>Install NEAR</Title>
    <Text>Install this app on your home screen for quick and easy access</Text>
    <Text className="d-inline-flex gap-1" fontWeight="600">
      Just tap <Icon className="ph-bold ph-export" /> then{" "}
      <Text color="var(--violet8)" fontWeight="600">
        &lsquo;Add to Home Screen&rsquo;
      </Text>
    </Text>
  </ContentWrapper>
);

const dialogStyles = {
  top: "calc(100% - 170px)",
  height: "50vh",
};

return (
  <Widget
    src="${REPL_ACCOUNT}/widget/DIG.Dialog"
    props={{
      type: "dialog",
      open,
      onOpenChange,
      overlayColor: "var(--blackA11)",
      content: <Content />,
      actionButtons: <></>,
      contentStyles: dialogStyles,
    }}
  />
);

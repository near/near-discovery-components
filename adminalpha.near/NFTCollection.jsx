const accountId = props.accountId || context.accountId;

if (!accountId) {
  return "";
}

const limitPerPage = 20;
let allNfts = [];
let results = [];

State.init({
  currentPage: 0,
});

const data = fetch(
  `https://api.kitwallet.app/account/${accountId}/likelyNFTsFromBlock`
);

if (data.body?.list) {
  allNfts = [];
  results = [];

  data.body.list.forEach((contractId, i) => {
    const nfts = Near.view(contractId, "nft_tokens_for_owner", {
      account_id: accountId,
      from_index: "0",
      limit: 200,
    });

    if (nfts?.length > 0) {
      nfts.forEach((nft) => {
        allNfts.push({
          ...nft,
          contractId,
        });

        allNfts = allNfts.slice(
          0,
          state.currentPage * limitPerPage + limitPerPage
        );
      });
    }

    if (nfts !== null) {
      results.push(nfts);
    }
  });
}

const hasFinishedLoading = data.body?.list?.length === results.length;
const showLoadMoreButton =
  allNfts.length > 0 && allNfts.length % limitPerPage === 0;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

const Items = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  @media (max-width: 550px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled.a`
  display: block;
  text-decoration: none;
  padding-top: 100%;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 12px 16px rgba(16, 24, 40, 0.08), 0px 4px 6px rgba(16, 24, 40, 0.03);

  .nft-thumbnail {
    position: absolute;
    inset: 0;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

const Text = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: ${(p) => (p.bold ? "#11181C" : "#687076")};
  font-weight: ${(p) => (p.bold ? "600" : "400")};
  font-size: ${(p) => (p.small ? "12px" : "14px")};
`;

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 8px;
  height: 32px;
  background: #FBFCFD;
  border: 1px solid #D7DBDF;
  border-radius: 50px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  cursor: pointer;
  color: #11181C !important;
  margin: 0;

  &:hover,
  &:focus {
    background: #ECEDEE;
    text-decoration: none;
    outline: none;
  }

  span {
    color: #687076 !important;
  }
`;

if (!hasFinishedLoading) return "Loading";

if (hasFinishedLoading && allNfts.length === 0) {
  return <Text>This account doesn&apos;t have any NFTs yet.</Text>;
}

return (
  <Wrapper>
    <Items>
      {allNfts.map((nft, i) => (
        <Card
          key={i}
          href={`/#/mob.near/widget/NftImage?tokenId=${nft.token_id}&contractId=${nft.contractId}`}
        >
          <Widget
            src="mob.near/widget/NftImage"
            props={{
              nft: { tokenId: nft.token_id, contractId: nft.contractId },
              className: "nft-thumbnail",
              fallbackUrl:
                "https://ipfs.near.social/ipfs/bafkreihdiy3ec4epkkx7wc4wevssruen6b7f3oep5ylicnpnyyqzayvcry",
              alt: `NFT ${nft.contractId} ${nft.token_id}`,
            }}
          />
        </Card>
      ))}
    </Items>

    {showLoadMoreButton && (
      <Button
        type="button"
        onClick={() => State.update({ currentPage: state.currentPage + 1 })}
      >
        Load More
      </Button>
    )}
  </Wrapper>
);

const accountId = props.accountId;
// if props.verifications passed in then fetching the verifications from the graphql is ignored
const verifications = props.verifications;
if (!accountId || !context.accountId) return null;

const GRAPHQL_ENDPOINT = props.GRAPHQL_ENDPOINT || "https://near-queryapi.api.pagoda.co";
State.init({
  verifications: verifications ?? null,
  loadingState: verifications ? "loaded" : "none",
});

const fetchGraphQL = (operationsDoc, operationName, variables) => {
  return asyncFetch(`${GRAPHQL_ENDPOINT}/v1/graphql`, {
    method: "POST",
    headers: { "x-hasura-role": "dataplatform_near" },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });
};

const createQuery = () => {
  return `
query GetVerifications {
    dataplatform_near_verifications_account(where: {account_id: {_eq: "${accountId}"}}) {
      human_provider
      human_valid_until
      human_verification_level
      kyc_provider
      kyc_valid_until
      kyc_verification_level
      social_trust_provider_1
      social_trust_provider_2
      social_trust_score_1
      social_trust_score_2
      account_id
    }
}
`;
};

const loadItems = () => {
  const queryName = "GetVerifications";
  return fetchGraphQL(createQuery(), queryName).then((result) => {
    if (result.status === 200 && result.body) {
      if (result.body.errors) {
        console.log("error:", result.body.errors);
        return;
      }
      let data = result.body.data;
      if (data) {
        const newItems = data.dataplatform_near_verifications_account;
        if (newItems && newItems[0]) {
          State.update({
            verifications: newItems[0],
            loadingState: "loaded",
          });
        }
      }
    }
  });
};

if (!state.loadingState || state.loadingState === "none") {
  State.update({ loadingState: "loading" });
  state.loadingState = "loading";
  loadItems();
  return <p>Loading verifications...</p>;
}
if (state.loadingState === "loaded" && !state.verifications) {
  return null;
}

const Wrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 5px;
`;

const VerificationItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const VerificationText = styled.div`
  font: var(--text-s);
  color: ${(props) => (props.secondary ? "var(--sand11)" : "var(--black)")};
`;
if (state.verifications) {
  return (
    <Wrapper>
      <VerificationItem>
        <Widget src="${REPL_ACCOUNT}/widget/Settings.Identity.Verifications.Icon" props={{ type: "base" }} />
        <VerificationText>Verified User</VerificationText>
      </VerificationItem>
      {state.verifications.human_provider && (
        <VerificationItem>
          <Widget src="${REPL_ACCOUNT}/widget/Settings.Identity.Verifications.Icon" props={{ type: "i-am-human" }} />
          <VerificationText secondary>
            Human by{" "}
            <Link href={`https://${state.verifications.human_provider}/`} target="_blank">
              {state.verifications.human_provider}
            </Link>
          </VerificationText>
        </VerificationItem>
      )}
      {state.verifications.kyc_provider && (
        <VerificationItem>
          <Widget src="${REPL_ACCOUNT}/widget/Settings.Identity.Verifications.Icon" props={{ type: "kyc" }} />
          <VerificationText secondary>
            KYC by{" "}
            <Link href={`https://${state.verifications.kyc_provider}/`} target="_blank">
              {state.verifications.kyc_provider}
            </Link>
          </VerificationText>
        </VerificationItem>
      )}
    </Wrapper>
  );
}

const accountId = props.accountId;
if (!accountId || !context.accountId) return null;

const GRAPHQL_ENDPOINT = props.GRAPHQL_ENDPOINT || "https://near-queryapi.api.pagoda.co";
State.init({
  verifications: null,
  loadingState: "none",
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

const VerificationText = styled.div`
  display: inline;
  position: relative;
  top: 1px;
  font-size: 14px;
  color: ${(props) => (props.secondary ? "#717069" : "black")};
`;
if (state.verifications) {
  return (
    <div>
      <div>
        <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M27.2325 11.8525C26.7613 11.36 26.2738 10.8525 26.09 10.4062C25.92 9.9975 25.91 9.32 25.9 8.66375C25.8812 7.44375 25.8612 6.06125 24.9 5.1C23.9387 4.13875 22.5563 4.11875 21.3363 4.1C20.68 4.09 20.0025 4.08 19.5938 3.91C19.1488 3.72625 18.64 3.23875 18.1475 2.7675C17.285 1.93875 16.305 1 15 1C13.695 1 12.7162 1.93875 11.8525 2.7675C11.36 3.23875 10.8525 3.72625 10.4062 3.91C10 4.08 9.32 4.09 8.66375 4.1C7.44375 4.11875 6.06125 4.13875 5.1 5.1C4.13875 6.06125 4.125 7.44375 4.1 8.66375C4.09 9.32 4.08 9.9975 3.91 10.4062C3.72625 10.8512 3.23875 11.36 2.7675 11.8525C1.93875 12.715 1 13.695 1 15C1 16.305 1.93875 17.2837 2.7675 18.1475C3.23875 18.64 3.72625 19.1475 3.91 19.5938C4.08 20.0025 4.09 20.68 4.1 21.3363C4.11875 22.5563 4.13875 23.9387 5.1 24.9C6.06125 25.8612 7.44375 25.8812 8.66375 25.9C9.32 25.91 9.9975 25.92 10.4062 26.09C10.8512 26.2738 11.36 26.7612 11.8525 27.2325C12.715 28.0612 13.695 29 15 29C16.305 29 17.2837 28.0612 18.1475 27.2325C18.64 26.7612 19.1475 26.2738 19.5938 26.09C20.0025 25.92 20.68 25.91 21.3363 25.9C22.5563 25.8812 23.9387 25.8612 24.9 24.9C25.8612 23.9387 25.8812 22.5563 25.9 21.3363C25.91 20.68 25.92 20.0025 26.09 19.5938C26.2738 19.1488 26.7613 18.64 27.2325 18.1475C28.0613 17.285 29 16.305 29 15C29 13.695 28.0613 12.7162 27.2325 11.8525Z"
            fill="white"
          />
          <path
            d="M11.8525 27.2325L11.5061 27.593C11.5221 27.6084 11.5382 27.6239 11.5545 27.6396C12.3785 28.432 13.4893 29.5 15 29.5C16.5081 29.5 17.6167 28.4355 18.4409 27.6439C18.4586 27.6269 18.4762 27.61 18.4937 27.5933L18.4974 27.5897C18.7452 27.3526 18.981 27.127 19.2083 26.9374C19.441 26.7432 19.6326 26.6147 19.7841 26.5523L19.7858 26.5517C19.9159 26.4976 20.1237 26.4572 20.4134 26.4333C20.6959 26.4099 21.0117 26.405 21.3439 26.3999L21.3439 26.3999C21.3688 26.3996 21.3939 26.3992 21.4192 26.3988C22.5866 26.3814 24.149 26.3581 25.2536 25.2536C26.3581 24.149 26.3814 22.5866 26.3988 21.4192C26.3992 21.3939 26.3996 21.3688 26.3999 21.3439L26.3999 21.3439C26.405 21.0117 26.4099 20.6959 26.4333 20.4134C26.4572 20.1237 26.4976 19.9159 26.5517 19.7858L26.5522 19.7846C26.6146 19.6334 26.7432 19.4417 26.9375 19.2086C27.1282 18.9799 27.3553 18.7424 27.5938 18.4932L27.2325 18.1475L27.593 18.4939C27.6084 18.4779 27.6239 18.4618 27.6396 18.4455C28.432 17.6215 29.5 16.5107 29.5 15C29.5 13.4919 28.4355 12.3833 27.6439 11.5591C27.6269 11.5414 27.61 11.5238 27.5933 11.5063L27.5897 11.5026C27.3525 11.2547 27.127 11.019 26.9374 10.7917C26.7432 10.559 26.6147 10.3674 26.5523 10.2159L26.5517 10.2142C26.4976 10.0841 26.4572 9.87629 26.4333 9.58663C26.4099 9.30407 26.405 8.9883 26.3999 8.65613L26.3999 8.65607C26.3996 8.63117 26.3992 8.60609 26.3988 8.58081C26.3814 7.41339 26.3581 5.85096 25.2536 4.74645C24.149 3.64194 22.5866 3.61862 21.4192 3.60119C21.3939 3.60082 21.3688 3.60044 21.3439 3.60006L21.3439 3.60006C21.0117 3.595 20.6959 3.59005 20.4134 3.5667C20.1237 3.54276 19.9159 3.50244 19.7858 3.44833L19.7846 3.44785C19.6334 3.38541 19.4417 3.25682 19.2086 3.06253C18.9799 2.8718 18.7424 2.64467 18.4932 2.40624L18.1475 2.7675M11.8525 27.2325L11.5068 27.5938C11.2576 27.3553 11.0201 27.1282 10.7914 26.9375C10.5583 26.7432 10.3666 26.6146 10.2154 26.5522L10.2142 26.5517C10.0841 26.4976 9.87629 26.4572 9.58663 26.4333C9.30407 26.4099 8.9883 26.405 8.65613 26.3999L8.65607 26.3999C8.63117 26.3996 8.60609 26.3992 8.58081 26.3988C7.4134 26.3814 5.85096 26.3581 4.74645 25.2536C3.64194 24.149 3.61862 22.5866 3.60119 21.4192C3.60082 21.3939 3.60044 21.3688 3.60006 21.3439L3.60006 21.3439C3.595 21.0117 3.59005 20.6959 3.5667 20.4134C3.54276 20.1237 3.50244 19.9159 3.44834 19.7858L3.44766 19.7841C3.38526 19.6326 3.25683 19.441 3.06263 19.2083C2.87301 18.981 2.6475 18.7453 2.41036 18.4975L2.40671 18.4937C2.38998 18.4762 2.3731 18.4586 2.3561 18.4409C1.56453 17.6167 0.5 16.5081 0.5 15C0.5 13.4893 1.56804 12.3785 2.36043 11.5545C2.37605 11.5382 2.39157 11.5221 2.40696 11.5061L2.7675 11.8525L2.40624 11.5068C2.64467 11.2576 2.8718 11.0201 3.06253 10.7914C3.25682 10.5583 3.38541 10.3666 3.44785 10.2154L3.44833 10.2142C3.50244 10.0841 3.54276 9.87629 3.5667 9.58663C3.59005 9.30407 3.595 8.9883 3.60006 8.65613L3.6001 8.65351H3.6001C3.60089 8.61532 3.60164 8.57667 3.6024 8.53758C3.62489 7.37913 3.65481 5.83809 4.74645 4.74645C5.85096 3.64194 7.41339 3.61862 8.58081 3.60119C8.60609 3.60082 8.63117 3.60044 8.65607 3.60006L8.65613 3.60006C8.98831 3.595 9.30472 3.59005 9.58761 3.5667C9.87795 3.54272 10.0851 3.50238 10.2132 3.44876L10.2159 3.44765L10.2159 3.44766C10.3674 3.38526 10.559 3.25683 10.7917 3.06263C11.019 2.873 11.2547 2.64748 11.5025 2.41033L11.5063 2.40671C11.5238 2.38998 11.5413 2.3731 11.5591 2.3561C12.3833 1.56453 13.4919 0.5 15 0.5C16.5107 0.5 17.6215 1.56804 18.4455 2.36043C18.4618 2.37605 18.4779 2.39157 18.4939 2.40696L18.1475 2.7675M11.8525 27.2325L11.8483 27.2284C11.3571 26.7585 10.85 26.2732 10.4062 26.09H19.5938C19.1509 26.2723 18.6478 26.7538 18.1588 27.2217L18.1475 27.2325C17.2837 28.0612 16.305 29 15 29C13.695 29 12.715 28.0612 11.8525 27.2325ZM18.1475 2.7675L18.1518 2.77157C18.6429 3.24155 19.15 3.72678 19.5938 3.91H10.4062C10.8491 3.72766 11.3522 3.24622 11.8412 2.77836L11.8525 2.7675C12.7162 1.93875 13.695 1 15 1C16.305 1 17.285 1.93875 18.1475 2.7675Z"
            stroke="white"
            strokeOpacity="0.923"
          />
          <path
            d="M27.2325 11.8525C26.7613 11.36 26.2738 10.8525 26.09 10.4062C25.92 9.9975 25.91 9.32 25.9 8.66375C25.8812 7.44375 25.8612 6.06125 24.9 5.1C23.9387 4.13875 22.5563 4.11875 21.3363 4.1C20.68 4.09 20.0025 4.08 19.5938 3.91C19.1488 3.72625 18.64 3.23875 18.1475 2.7675C17.285 1.93875 16.305 1 15 1C13.695 1 12.7162 1.93875 11.8525 2.7675C11.36 3.23875 10.8525 3.72625 10.4062 3.91C10 4.08 9.32 4.09 8.66375 4.1C7.44375 4.11875 6.06125 4.13875 5.1 5.1C4.13875 6.06125 4.125 7.44375 4.1 8.66375C4.09 9.32 4.08 9.9975 3.91 10.4062C3.72625 10.8512 3.23875 11.36 2.7675 11.8525C1.93875 12.715 1 13.695 1 15C1 16.305 1.93875 17.2837 2.7675 18.1475C3.23875 18.64 3.72625 19.1475 3.91 19.5938C4.08 20.0025 4.09 20.68 4.1 21.3363C4.11875 22.5563 4.13875 23.9387 5.1 24.9C6.06125 25.8612 7.44375 25.8812 8.66375 25.9C9.32 25.91 9.9975 25.92 10.4062 26.09C10.8512 26.2738 11.36 26.7612 11.8525 27.2325C12.715 28.0612 13.695 29 15 29C16.305 29 17.2837 28.0612 18.1475 27.2325C18.64 26.7612 19.1475 26.2738 19.5938 26.09C20.0025 25.92 20.68 25.91 21.3363 25.9C22.5563 25.8812 23.9387 25.8612 24.9 24.9C25.8612 23.9387 25.8812 22.5563 25.9 21.3363C25.91 20.68 25.92 20.0025 26.09 19.5938C26.2738 19.1488 26.7613 18.64 27.2325 18.1475C28.0613 17.285 29 16.305 29 15C29 13.695 28.0613 12.7162 27.2325 11.8525ZM20.7075 11.2925C20.8005 11.3854 20.8742 11.4957 20.9246 11.6171C20.9749 11.7385 21.0008 11.8686 21.0008 12C21.0008 12.1314 20.9749 12.2615 20.9246 12.3829C20.8742 12.5043 20.8005 12.6146 20.7075 12.7075L13.7075 19.7075C13.6146 19.8005 13.5043 19.8742 13.3829 19.9246C13.2615 19.9749 13.1314 20.0008 13 20.0008C12.8686 20.0008 12.7385 19.9749 12.6171 19.9246C12.4957 19.8742 12.3854 19.8005 12.2925 19.7075L9.2925 16.7075C9.10486 16.5199 8.99944 16.2654 8.99944 16C8.99944 15.7346 9.10486 15.4801 9.2925 15.2925C9.48014 15.1049 9.73464 14.9994 10 14.9994C10.2654 14.9994 10.5199 15.1049 10.7075 15.2925L13 17.5863L19.2925 11.2925C19.3854 11.1995 19.4957 11.1258 19.6171 11.0754C19.7385 11.0251 19.8686 10.9992 20 10.9992C20.1314 10.9992 20.2615 11.0251 20.3829 11.0754C20.5043 11.1258 20.6146 11.1995 20.7075 11.2925Z"
            fill="#202425"
          />
        </svg>
        <VerificationText>Verified User</VerificationText>
      </div>
      {state.verifications.human_provider && (
        <div style={{ textAlign: "bottom" }}>
          <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M27.2325 11.8525C26.7613 11.36 26.2738 10.8525 26.09 10.4062C25.92 9.9975 25.91 9.32 25.9 8.66375C25.8812 7.44375 25.8612 6.06125 24.9 5.1C23.9387 4.13875 22.5563 4.11875 21.3363 4.1C20.68 4.09 20.0025 4.08 19.5938 3.91C19.1488 3.72625 18.64 3.23875 18.1475 2.7675C17.285 1.93875 16.305 1 15 1C13.695 1 12.7162 1.93875 11.8525 2.7675C11.36 3.23875 10.8525 3.72625 10.4062 3.91C10 4.08 9.32 4.09 8.66375 4.1C7.44375 4.11875 6.06125 4.13875 5.1 5.1C4.13875 6.06125 4.125 7.44375 4.1 8.66375C4.09 9.32 4.08 9.9975 3.91 10.4062C3.72625 10.8512 3.23875 11.36 2.7675 11.8525C1.93875 12.715 1 13.695 1 15C1 16.305 1.93875 17.2837 2.7675 18.1475C3.23875 18.64 3.72625 19.1475 3.91 19.5938C4.08 20.0025 4.09 20.68 4.1 21.3363C4.11875 22.5563 4.13875 23.9387 5.1 24.9C6.06125 25.8612 7.44375 25.8812 8.66375 25.9C9.32 25.91 9.9975 25.92 10.4062 26.09C10.8512 26.2738 11.36 26.7612 11.8525 27.2325C12.715 28.0612 13.695 29 15 29C16.305 29 17.2837 28.0612 18.1475 27.2325C18.64 26.7612 19.1475 26.2738 19.5938 26.09C20.0025 25.92 20.68 25.91 21.3363 25.9C22.5563 25.8812 23.9387 25.8612 24.9 24.9C25.8612 23.9387 25.8812 22.5563 25.9 21.3363C25.91 20.68 25.92 20.0025 26.09 19.5938C26.2738 19.1488 26.7613 18.64 27.2325 18.1475C28.0613 17.285 29 16.305 29 15C29 13.695 28.0613 12.7162 27.2325 11.8525Z"
              fill="white"
            />
            <path
              d="M11.8525 27.2325L11.5061 27.593C11.5221 27.6084 11.5382 27.6239 11.5545 27.6396C12.3785 28.432 13.4893 29.5 15 29.5C16.5081 29.5 17.6167 28.4355 18.4409 27.6439C18.4586 27.6269 18.4762 27.61 18.4937 27.5933L18.4974 27.5897C18.7452 27.3526 18.981 27.127 19.2083 26.9374C19.441 26.7432 19.6326 26.6147 19.7841 26.5523L19.7858 26.5517C19.9159 26.4976 20.1237 26.4572 20.4134 26.4333C20.6959 26.4099 21.0117 26.405 21.3439 26.3999L21.3439 26.3999C21.3688 26.3996 21.3939 26.3992 21.4192 26.3988C22.5866 26.3814 24.149 26.3581 25.2536 25.2536C26.3581 24.149 26.3814 22.5866 26.3988 21.4192C26.3992 21.3939 26.3996 21.3688 26.3999 21.3439L26.3999 21.3439C26.405 21.0117 26.4099 20.6959 26.4333 20.4134C26.4572 20.1237 26.4976 19.9159 26.5517 19.7858L26.5522 19.7846C26.6146 19.6334 26.7432 19.4417 26.9375 19.2086C27.1282 18.9799 27.3553 18.7424 27.5938 18.4932L27.2325 18.1475L27.593 18.4939C27.6084 18.4779 27.6239 18.4618 27.6396 18.4455C28.432 17.6215 29.5 16.5107 29.5 15C29.5 13.4919 28.4355 12.3833 27.6439 11.5591C27.6269 11.5414 27.61 11.5238 27.5933 11.5063L27.5897 11.5026C27.3525 11.2547 27.127 11.019 26.9374 10.7917C26.7432 10.559 26.6147 10.3674 26.5523 10.2159L26.5517 10.2142C26.4976 10.0841 26.4572 9.87629 26.4333 9.58663C26.4099 9.30407 26.405 8.9883 26.3999 8.65613L26.3999 8.65607C26.3996 8.63117 26.3992 8.60609 26.3988 8.58081C26.3814 7.41339 26.3581 5.85096 25.2536 4.74645C24.149 3.64194 22.5866 3.61862 21.4192 3.60119C21.3939 3.60082 21.3688 3.60044 21.3439 3.60006L21.3439 3.60006C21.0117 3.595 20.6959 3.59005 20.4134 3.5667C20.1237 3.54276 19.9159 3.50244 19.7858 3.44833L19.7846 3.44785C19.6334 3.38541 19.4417 3.25682 19.2086 3.06253C18.9799 2.8718 18.7424 2.64467 18.4932 2.40624L18.1475 2.7675M11.8525 27.2325L11.5068 27.5938C11.2576 27.3553 11.0201 27.1282 10.7914 26.9375C10.5583 26.7432 10.3666 26.6146 10.2154 26.5522L10.2142 26.5517C10.0841 26.4976 9.87629 26.4572 9.58663 26.4333C9.30407 26.4099 8.9883 26.405 8.65613 26.3999L8.65607 26.3999C8.63117 26.3996 8.60609 26.3992 8.58081 26.3988C7.4134 26.3814 5.85096 26.3581 4.74645 25.2536C3.64194 24.149 3.61862 22.5866 3.60119 21.4192C3.60082 21.3939 3.60044 21.3688 3.60006 21.3439L3.60006 21.3439C3.595 21.0117 3.59005 20.6959 3.5667 20.4134C3.54276 20.1237 3.50244 19.9159 3.44834 19.7858L3.44766 19.7841C3.38526 19.6326 3.25683 19.441 3.06263 19.2083C2.87301 18.981 2.6475 18.7453 2.41036 18.4975L2.40671 18.4937C2.38998 18.4762 2.3731 18.4586 2.3561 18.4409C1.56453 17.6167 0.5 16.5081 0.5 15C0.5 13.4893 1.56804 12.3785 2.36043 11.5545C2.37605 11.5382 2.39157 11.5221 2.40696 11.5061L2.7675 11.8525L2.40624 11.5068C2.64467 11.2576 2.8718 11.0201 3.06253 10.7914C3.25682 10.5583 3.38541 10.3666 3.44785 10.2154L3.44833 10.2142C3.50244 10.0841 3.54276 9.87629 3.5667 9.58663C3.59005 9.30407 3.595 8.9883 3.60006 8.65613L3.6001 8.65351H3.6001C3.60089 8.61532 3.60164 8.57667 3.6024 8.53758C3.62489 7.37913 3.65481 5.83809 4.74645 4.74645C5.85096 3.64194 7.41339 3.61862 8.58081 3.60119C8.60609 3.60082 8.63117 3.60044 8.65607 3.60006L8.65613 3.60006C8.98831 3.595 9.30472 3.59005 9.58761 3.5667C9.87795 3.54272 10.0851 3.50238 10.2132 3.44876L10.2159 3.44765L10.2159 3.44766C10.3674 3.38526 10.559 3.25683 10.7917 3.06263C11.019 2.873 11.2547 2.64748 11.5025 2.41033L11.5063 2.40671C11.5238 2.38998 11.5413 2.3731 11.5591 2.3561C12.3833 1.56453 13.4919 0.5 15 0.5C16.5107 0.5 17.6215 1.56804 18.4455 2.36043C18.4618 2.37605 18.4779 2.39157 18.4939 2.40696L18.1475 2.7675M11.8525 27.2325L11.8483 27.2284C11.3571 26.7585 10.85 26.2732 10.4062 26.09H19.5938C19.1509 26.2723 18.6478 26.7538 18.1588 27.2217L18.1475 27.2325C17.2837 28.0612 16.305 29 15 29C13.695 29 12.715 28.0612 11.8525 27.2325ZM18.1475 2.7675L18.1518 2.77157C18.6429 3.24155 19.15 3.72678 19.5938 3.91H10.4062C10.8491 3.72766 11.3522 3.24622 11.8412 2.77836L11.8525 2.7675C12.7162 1.93875 13.695 1 15 1C16.305 1 17.285 1.93875 18.1475 2.7675Z"
              stroke="white"
              strokeOpacity="0.923"
            />
            <path
              d="M15.6235 15.663C15.3052 15.8828 14.931 16.0001 14.5482 16.0001C14.0349 16.0001 13.5426 15.7893 13.1796 15.4143C12.8166 15.0392 12.6127 14.5305 12.6127 14.0001C12.6127 13.6045 12.7262 13.2178 12.9389 12.8889C13.1516 12.56 13.4538 12.3037 13.8075 12.1523C14.1612 12.0009 14.5503 11.9613 14.9258 12.0385C15.3012 12.1157 15.6461 12.3061 15.9168 12.5858C16.1875 12.8656 16.3718 13.2219 16.4465 13.6099C16.5212 13.9978 16.4828 14.4 16.3363 14.7654C16.1898 15.1309 15.9418 15.4432 15.6235 15.663Z"
              fill="#7C66DC"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M26.3758 11.8412L26.3863 11.8525C27.1883 12.7162 28.0968 13.695 28.0968 15C28.0968 16.305 27.1883 17.285 26.3863 18.1475L26.3824 18.1517C25.9275 18.6429 25.458 19.15 25.2806 19.5938C25.1165 20.0017 25.1065 20.6773 25.0968 21.3324L25.0967 21.3411C25.0786 22.5599 25.0581 23.94 24.129 24.9C23.2 25.86 21.8644 25.8812 20.6849 25.8999L20.6765 25.9001C20.0426 25.91 19.3887 25.9203 18.994 26.09C18.5654 26.2723 18.0785 26.7538 17.6053 27.2216L17.5944 27.2325C16.7585 28.0613 15.8113 29 14.5484 29C13.2855 29 12.3383 28.0613 11.5024 27.2325L11.4983 27.2284C11.023 26.7584 10.5322 26.2732 10.1028 26.09C9.70804 25.9203 9.0542 25.91 8.42029 25.9001L8.41188 25.8999C7.23238 25.8812 5.89676 25.86 4.96774 24.9C4.03872 23.94 4.0182 22.5599 4.00007 21.3411L3.99994 21.3324C3.99028 20.6773 3.98032 20.0017 3.81613 19.5938C3.63967 19.1509 3.17376 18.6478 2.721 18.1589L2.71048 18.1475C1.90847 17.2837 1 16.305 1 15C1 13.695 1.90847 12.715 2.71048 11.8525L2.721 11.8411C3.17376 11.3522 3.63967 10.8491 3.81613 10.4062C3.98032 9.99831 3.99028 9.32267 3.99994 8.66763L4 8.66375C4.00036 8.64546 4.00072 8.62714 4.00108 8.60878C4.0248 7.40239 4.05145 6.04684 4.96774 5.1C5.89676 4.14001 7.23237 4.1188 8.41188 4.10007L8.42072 4.09993C9.05451 4.08996 9.71054 4.07963 10.1028 3.91C10.5314 3.72766 11.0183 3.24622 11.4914 2.77837L11.5024 2.7675C12.3383 1.93875 13.2855 1 14.5484 1C15.8113 1 16.7585 1.93875 17.5944 2.7675L17.6053 2.77836C18.0785 3.24622 18.5654 3.72766 18.994 3.91C19.3887 4.07967 20.0426 4.08996 20.6765 4.09994L20.6849 4.10007C21.8644 4.1188 23.2 4.14001 24.129 5.1C25.0581 6.05999 25.0786 7.44012 25.0967 8.65894L25.0968 8.66763C25.1065 9.32267 25.1165 9.99831 25.2806 10.4062C25.4571 10.8491 25.923 11.3522 26.3758 11.8412ZM19.2519 20.5083C19.3824 20.2797 19.4196 20.007 19.3554 19.7501H19.3566C19.0432 18.5416 18.3002 17.4998 17.276 16.8326C17.8197 16.2741 18.1906 15.5614 18.3419 14.7848C18.4931 14.0083 18.4178 13.2028 18.1255 12.4705C17.8332 11.7382 17.337 11.1121 16.7 10.6715C16.0629 10.2309 15.3136 9.99573 14.547 9.99573C13.7804 9.99573 13.0311 10.2309 12.394 10.6715C11.7569 11.1121 11.2608 11.7382 10.9685 12.4705C10.6762 13.2028 10.6008 14.0083 10.7521 14.7848C10.9033 15.5614 11.2743 16.2741 11.8179 16.8326C10.7949 17.5007 10.0525 18.5422 9.7385 19.7501C9.67434 20.007 9.71157 20.2797 9.84202 20.5083C9.97246 20.7368 10.1854 20.9025 10.4341 20.9688C10.6827 21.0351 10.9467 20.9966 11.1678 20.8618C11.389 20.7271 11.5493 20.507 11.6135 20.2501C11.9329 18.9676 13.1933 18.0001 14.547 18.0001C15.9006 18.0001 17.1623 18.9676 17.4804 20.2501C17.5446 20.507 17.7049 20.7271 17.9261 20.8618C18.1473 20.9966 18.4112 21.0351 18.6599 20.9688C18.9085 20.9025 19.1215 20.7368 19.2519 20.5083Z"
              fill="#7C66DC"
            />
          </svg>
          <VerificationText secondary>
            Human by{" "}
            <a href={"https://" + state.verifications.human_provider + "/"} target="_new">
              {state.verifications.human_provider}
            </a>
          </VerificationText>
        </div>
      )}
      {state.verifications.kyc_provider && (
        <div>
          <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M27.2325 11.8525C26.7613 11.36 26.2738 10.8525 26.09 10.4062C25.92 9.9975 25.91 9.32 25.9 8.66375C25.8812 7.44375 25.8612 6.06125 24.9 5.1C23.9387 4.13875 22.5563 4.11875 21.3363 4.1C20.68 4.09 20.0025 4.08 19.5938 3.91C19.1488 3.72625 18.64 3.23875 18.1475 2.7675C17.285 1.93875 16.305 1 15 1C13.695 1 12.7162 1.93875 11.8525 2.7675C11.36 3.23875 10.8525 3.72625 10.4062 3.91C10 4.08 9.32 4.09 8.66375 4.1C7.44375 4.11875 6.06125 4.13875 5.1 5.1C4.13875 6.06125 4.125 7.44375 4.1 8.66375C4.09 9.32 4.08 9.9975 3.91 10.4062C3.72625 10.8512 3.23875 11.36 2.7675 11.8525C1.93875 12.715 1 13.695 1 15C1 16.305 1.93875 17.2837 2.7675 18.1475C3.23875 18.64 3.72625 19.1475 3.91 19.5938C4.08 20.0025 4.09 20.68 4.1 21.3363C4.11875 22.5563 4.13875 23.9387 5.1 24.9C6.06125 25.8612 7.44375 25.8812 8.66375 25.9C9.32 25.91 9.9975 25.92 10.4062 26.09C10.8512 26.2738 11.36 26.7612 11.8525 27.2325C12.715 28.0612 13.695 29 15 29C16.305 29 17.2837 28.0612 18.1475 27.2325C18.64 26.7612 19.1475 26.2738 19.5938 26.09C20.0025 25.92 20.68 25.91 21.3363 25.9C22.5563 25.8812 23.9387 25.8612 24.9 24.9C25.8612 23.9387 25.8812 22.5563 25.9 21.3363C25.91 20.68 25.92 20.0025 26.09 19.5938C26.2738 19.1488 26.7613 18.64 27.2325 18.1475C28.0613 17.285 29 16.305 29 15C29 13.695 28.0613 12.7162 27.2325 11.8525Z"
              fill="white"
            />
            <path
              d="M11.8525 27.2325L11.5061 27.593C11.5221 27.6084 11.5382 27.6239 11.5545 27.6396C12.3785 28.432 13.4893 29.5 15 29.5C16.5081 29.5 17.6167 28.4355 18.4409 27.6439C18.4586 27.6269 18.4762 27.61 18.4937 27.5933L18.4974 27.5897C18.7452 27.3526 18.981 27.127 19.2083 26.9374C19.441 26.7432 19.6326 26.6147 19.7841 26.5523L19.7858 26.5517C19.9159 26.4976 20.1237 26.4572 20.4134 26.4333C20.6959 26.4099 21.0117 26.405 21.3439 26.3999L21.3439 26.3999C21.3688 26.3996 21.3939 26.3992 21.4192 26.3988C22.5866 26.3814 24.149 26.3581 25.2536 25.2536C26.3581 24.149 26.3814 22.5866 26.3988 21.4192C26.3992 21.3939 26.3996 21.3688 26.3999 21.3439L26.3999 21.3439C26.405 21.0117 26.4099 20.6959 26.4333 20.4134C26.4572 20.1237 26.4976 19.9159 26.5517 19.7858L26.5522 19.7846C26.6146 19.6334 26.7432 19.4417 26.9375 19.2086C27.1282 18.9799 27.3553 18.7424 27.5938 18.4932L27.2325 18.1475L27.593 18.4939C27.6084 18.4779 27.6239 18.4618 27.6396 18.4455C28.432 17.6215 29.5 16.5107 29.5 15C29.5 13.4919 28.4355 12.3833 27.6439 11.5591C27.6269 11.5414 27.61 11.5238 27.5933 11.5063L27.5897 11.5026C27.3525 11.2547 27.127 11.019 26.9374 10.7917C26.7432 10.559 26.6147 10.3674 26.5523 10.2159L26.5517 10.2142C26.4976 10.0841 26.4572 9.87629 26.4333 9.58663C26.4099 9.30407 26.405 8.9883 26.3999 8.65613L26.3999 8.65607C26.3996 8.63117 26.3992 8.60609 26.3988 8.58081C26.3814 7.41339 26.3581 5.85096 25.2536 4.74645C24.149 3.64194 22.5866 3.61862 21.4192 3.60119C21.3939 3.60082 21.3688 3.60044 21.3439 3.60006L21.3439 3.60006C21.0117 3.595 20.6959 3.59005 20.4134 3.5667C20.1237 3.54276 19.9159 3.50244 19.7858 3.44833L19.7846 3.44785C19.6334 3.38541 19.4417 3.25682 19.2086 3.06253C18.9799 2.8718 18.7424 2.64467 18.4932 2.40624L18.1475 2.7675M11.8525 27.2325L11.5068 27.5938C11.2576 27.3553 11.0201 27.1282 10.7914 26.9375C10.5583 26.7432 10.3666 26.6146 10.2154 26.5522L10.2142 26.5517C10.0841 26.4976 9.87629 26.4572 9.58663 26.4333C9.30407 26.4099 8.9883 26.405 8.65613 26.3999L8.65607 26.3999C8.63117 26.3996 8.60609 26.3992 8.58081 26.3988C7.4134 26.3814 5.85096 26.3581 4.74645 25.2536C3.64194 24.149 3.61862 22.5866 3.60119 21.4192C3.60082 21.3939 3.60044 21.3688 3.60006 21.3439L3.60006 21.3439C3.595 21.0117 3.59005 20.6959 3.5667 20.4134C3.54276 20.1237 3.50244 19.9159 3.44834 19.7858L3.44766 19.7841C3.38526 19.6326 3.25683 19.441 3.06263 19.2083C2.87301 18.981 2.6475 18.7453 2.41036 18.4975L2.40671 18.4937C2.38998 18.4762 2.3731 18.4586 2.3561 18.4409C1.56453 17.6167 0.5 16.5081 0.5 15C0.5 13.4893 1.56804 12.3785 2.36043 11.5545C2.37605 11.5382 2.39157 11.5221 2.40696 11.5061L2.7675 11.8525L2.40624 11.5068C2.64467 11.2576 2.8718 11.0201 3.06253 10.7914C3.25682 10.5583 3.38541 10.3666 3.44785 10.2154L3.44833 10.2142C3.50244 10.0841 3.54276 9.87629 3.5667 9.58663C3.59005 9.30407 3.595 8.9883 3.60006 8.65613L3.6001 8.65351H3.6001C3.60089 8.61532 3.60164 8.57667 3.6024 8.53758C3.62489 7.37913 3.65481 5.83809 4.74645 4.74645C5.85096 3.64194 7.41339 3.61862 8.58081 3.60119C8.60609 3.60082 8.63117 3.60044 8.65607 3.60006L8.65613 3.60006C8.98831 3.595 9.30472 3.59005 9.58761 3.5667C9.87795 3.54272 10.0851 3.50238 10.2132 3.44876L10.2159 3.44765L10.2159 3.44766C10.3674 3.38526 10.559 3.25683 10.7917 3.06263C11.019 2.873 11.2547 2.64748 11.5025 2.41033L11.5063 2.40671C11.5238 2.38998 11.5413 2.3731 11.5591 2.3561C12.3833 1.56453 13.4919 0.5 15 0.5C16.5107 0.5 17.6215 1.56804 18.4455 2.36043C18.4618 2.37605 18.4779 2.39157 18.4939 2.40696L18.1475 2.7675M11.8525 27.2325L11.8483 27.2284C11.3571 26.7585 10.85 26.2732 10.4062 26.09H19.5938C19.1509 26.2723 18.6478 26.7538 18.1588 27.2217L18.1475 27.2325C17.2837 28.0612 16.305 29 15 29C13.695 29 12.715 28.0612 11.8525 27.2325ZM18.1475 2.7675L18.1518 2.77157C18.6429 3.24155 19.15 3.72678 19.5938 3.91H10.4062C10.8491 3.72766 11.3522 3.24622 11.8412 2.77836L11.8525 2.7675C12.7162 1.93875 13.695 1 15 1C16.305 1 17.285 1.93875 18.1475 2.7675Z"
              stroke="white"
              strokeOpacity="0.923"
            />
            <path
              d="M27.2325 11.8525C26.7612 11.36 26.2738 10.8525 26.09 10.4062C25.92 9.9975 25.91 9.32 25.9 8.66375C25.8813 7.44375 25.8612 6.06125 24.9 5.1C23.9387 4.13875 22.5562 4.11875 21.3363 4.1C20.68 4.09 20.0025 4.08 19.5938 3.91C19.1488 3.72625 18.64 3.23875 18.1475 2.7675C17.285 1.93875 16.305 1 15 1C13.695 1 12.7162 1.93875 11.8525 2.7675C11.36 3.23875 10.8525 3.72625 10.4062 3.91C10 4.08 9.32 4.09 8.66375 4.1C7.44375 4.11875 6.06125 4.13875 5.1 5.1C4.13875 6.06125 4.125 7.44375 4.1 8.66375C4.09 9.32 4.08 9.9975 3.91 10.4062C3.72625 10.8512 3.23875 11.36 2.7675 11.8525C1.93875 12.715 1 13.695 1 15C1 16.305 1.93875 17.2837 2.7675 18.1475C3.23875 18.64 3.72625 19.1475 3.91 19.5938C4.08 20.0025 4.09 20.68 4.1 21.3363C4.11875 22.5562 4.13875 23.9387 5.1 24.9C6.06125 25.8612 7.44375 25.8812 8.66375 25.9C9.32 25.91 9.9975 25.92 10.4062 26.09C10.8512 26.2738 11.36 26.7612 11.8525 27.2325C12.715 28.0612 13.695 29 15 29C16.305 29 17.2837 28.0612 18.1475 27.2325C18.64 26.7612 19.1475 26.2738 19.5938 26.09C20.0025 25.92 20.68 25.91 21.3363 25.9C22.5562 25.8812 23.9387 25.8612 24.9 24.9C25.8612 23.9387 25.8813 22.5562 25.9 21.3363C25.91 20.68 25.92 20.0025 26.09 19.5938C26.2738 19.1488 26.7612 18.64 27.2325 18.1475C28.0613 17.285 29 16.305 29 15C29 13.695 28.0613 12.7162 27.2325 11.8525ZM20.7075 11.2925C20.8005 11.3854 20.8742 11.4957 20.9246 11.6171C20.9749 11.7385 21.0008 11.8686 21.0008 12C21.0008 12.1314 20.9749 12.2615 20.9246 12.3829C20.8742 12.5043 20.8005 12.6146 20.7075 12.7075L13.7075 19.7075C13.6146 19.8005 13.5043 19.8742 13.3829 19.9246C13.2615 19.9749 13.1314 20.0008 13 20.0008C12.8686 20.0008 12.7385 19.9749 12.6171 19.9246C12.4957 19.8742 12.3854 19.8005 12.2925 19.7075L9.2925 16.7075C9.10486 16.5199 8.99944 16.2654 8.99944 16C8.99944 15.7346 9.10486 15.4801 9.2925 15.2925C9.48014 15.1049 9.73464 14.9994 10 14.9994C10.2654 14.9994 10.5199 15.1049 10.7075 15.2925L13 17.5863L19.2925 11.2925C19.3854 11.1995 19.4957 11.1258 19.6171 11.0754C19.7385 11.0251 19.8686 10.9992 20 10.9992C20.1314 10.9992 20.2615 11.0251 20.3829 11.0754C20.5043 11.1258 20.6146 11.1995 20.7075 11.2925Z"
              fill="#3CB179"
            />
          </svg>
          <VerificationText secondary>
            KYC by{" "}
            <a href={"https://" + state.verifications.kyc_provider + "/"} target="_new">
              {state.verifications.kyc_provider}
            </a>
          </VerificationText>
        </div>
      )}
    </div>
  );
}

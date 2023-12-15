const firstPartyCookies = `| Identifer                     | Purpose           | Provider    | Domain    | Details                                                                     | Duration | Actual Purpose                                           |
| ----------------------------- | ----------------- | ----------- | --------- | --------------------------------------------------------------------------- | -------- | -------------------------------------------------------- |
| rl_user_id                    | product analytics | Rudderstack | .near.org | [Link](https://cookiedatabase.org/?lang=en&s=rl_user_id)                    | 1 year   | to store a unique user ID.                               |
| rl_trait                      | product analytics | Rudderstack | .near.org | [Link](https://cookiedatabase.org/?lang=en&s=rl_trait)                      | 1 year   | to store performed actions on the website.               |
| rl_session                    | product analytics | Rudderstack | .near.org | [Link](https://cookiedatabase.org/?lang=en&s=rl_session)                    | 1 year   | Stores the session-related information including the ID. |
| rl_page_init_referring_domain | product analytics | Rudderstack | .near.org | [Link](https://cookiedatabase.org/?lang=en&s=rl_page_init_referring_domain) | 1 year   | to store referring website.                              |
| rl_page_init_referrer         | product analytics | Rudderstack | .near.org | [Link](https://cookiedatabase.org/?lang=en&s=rl_page_init_referrer)         | 1 year   | to store referring website.                              |
`;

const thirdPartyCookies = `| Identifer                                     | Purpose               | Provider      | Domain                | Duration |
|-----------------------------------------------|-----------------------|---------------|-----------------------|----------|
| aeb0-187febdb30e5R...1hgeca2o5.1hgeca2o6.9.0.9 | Functional/Essential  | Fractal iDOS  | .idos.network         | 1 year   |
| idOS-signer-public-key                        | Functional/Essential  | Fractal iDOS  | enclave.idos.network  | 1 year   |
| idOS-signer-address                           | Functional/Essential  | Fractal iDOS  | enclave.idos.network  | 1 year   |
| idOS-password                                 | Functional/Essential  | Fractal iDOS  | enclave.idos.network  | 1 year   |
| idOS-human-id                                 | Functional/Essential  | Fractal iDOS  | enclave.idos.network  | 1 year   |
`;

return (
  <Widget
    src="near/widget/DIG.Tabs"
    props={{
      items: [
        {
          name: "1st Party Cookies",
          value: "1",
          content: <Markdown text={firstPartyCookies} />,
          icon: "ph ph-cookie",
        },
        {
          name: "3rd Party Cookies",
          value: "2",
          content: <Markdown text={thirdPartyCookies} />,
          icon: "ph ph-hand-heart",
        },
      ],
    }}
  />
);

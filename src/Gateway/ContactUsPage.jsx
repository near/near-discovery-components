let { emitGatewayEvent } = props;

const urls = {
  discord: "http://near.chat",
  discourse: "https://gov.near.org",
  docs: "https://docs.near.org",
  getFunding: "https://near.org/ecosystem/get-funding",
  github: "https://github.com/near",
  hackenproof: "https://hackenproof.com/near",
  helpCenter: "https://nearhelp.zendesk.com/hc/en-us",
  nearWallet: "https://wallet.near.org/",
  nearWeek: "https://subscribe.nearweek.com/",
  supportRequest: "https://nearhelp.zendesk.com/hc/en-us/requests/new",
  telegram: "https://t.me/neardev",
  twitter: "https://twitter.com/nearprotocol",
  wechat: "https://pages.near.org/wechat",
  withdrawNearFunds:
    "https://nearhelp.zendesk.com/hc/en-us/articles/360060927734-Staking-Unstaking-and-Withdrawing-NEAR",
  youtube: "https://www.youtube.com/channel/UCuKdIYVN8iE3fv8alyk1aMw",
};

const channels = [
  {
    icon: "ph-telegram-logo",
    label: "Telegram",
    url: urls.telegram,
  },
  {
    icon: "ph-discord-logo",
    label: "Discord",
    url: urls.discord,
  },
  {
    icon: "ph-github-logo",
    label: "GitHub",
    url: urls.github,
  },
  {
    icon: "ph-file-text",
    label: "Docs",
    url: urls.docs,
  },
  {
    icon: "ph-wechat-logo",
    label: "WeChat",
    url: urls.wechat,
  },
  {
    icon: "ph-twitter-logo",
    label: "X",
    url: urls.twitter,
  },
];

const faqs = [
  {
    question: "What is the expectation for a support resolution?",
    answer: (
      <>
        Upon submitting a support ticket, you can expect to receive an initial response from our team within 72 hours
        during our business hours. Our business hours are on weekdays in the PST timezone, excluding US holidays.
      </>
    ),
  },
  {
    question: "Where can I find help to troubleshoot a development issue?",
    answer: (
      <>
        Social channels such as{" "}
        <a href={urls.telegram} target="_blank">
          Telegram
        </a>{" "}
        and
        <a href={urls.discord} target="_blank">
          Discord
        </a>{" "}
        are a great resource to tap into for community support on development issues. If you can't find a solution,
        please submit a{" "}
        <a href={urls.supportRequest} target="_blank">
          support request
        </a>{" "}
        to our Customer Care team.
      </>
    ),
  },
  {
    question: "Where can I find funding for my project?",
    answer: (
      <>
        <a href={urls.devHub} target="_blank">
          DevHub
        </a>
        , powered by DevDAO, is a central platform offering funding opportunities for NEAR ecosystem projects aimed at
        fostering a self-sufficient developer community. We evaluate proposals based on their alignment with our goals,
        execution capabilities, and clear use of funds. To initiate the{" "}
        <a href={urls.getFunding} target="_blank">
          funding process
        </a>
        for your project, engage with the community on DevHub's activity feed.
      </>
    ),
  },
  {
    question: "How can I find out about the latest product developments?",
    answer: (
      <>
        Follow{" "}
        <a href={urls.twitter} target="_blank">
          NEAR on X
        </a>
        for our latest product announcements or subscribe to{" "}
        <a href={urls.nearWeek} target="_blank">
          NEAR Week
        </a>
        to receive their weekly newsletter on ecosystem announcements.
      </>
    ),
  },
  {
    question: "I found a bug — where can I flag this?",
    answer: (
      <>
        For any issues or concerns you've encountered, please feel free to provide us with detailed information through
        our{" "}
        <a href={urls.hackenproof} target="_blank">
          Bug Bounty Program
        </a>
        . Your cooperation and additional details will assist us in addressing and resolving any potential
        vulnerabilities effectively. We appreciate your proactive approach in helping us maintain the security and
        integrity of the NEAR ecosystem. If you have any further questions or need assistance, don't hesitate to reach
        out to us.
      </>
    ),
  },
  {
    question: "What happened to Near Wallet?",
    answer: (
      <>
        As we embrace a more decentralized future, wallet.near.org will be discontinued. This change invites you to
        discover a variety of new and secure wallet options within our ecosystem. Your funds are safe! Accounts exist on
        the blockchain, not in a wallet. Wallets are just an interface into using the blockchain with your account.
        <a href={urls.nearWallet} target="_blank">
          Learn more
        </a>
      </>
    ),
  },
  {
    question: "Question about Transfer Exchange?",
    answer: (
      <>
        For issues relating to a third-party exchange, such as Binance or Coinbase we're unable to investigate issues on
        external platforms like these. To address your concern effectively, we recommend contacting the customer support
        team of the specific exchange where you're experiencing issues. They are most equipped to assist you in
        resolving the matter.
      </>
    ),
  },
  {
    question: "How do I withdraw NEAR funds?",
    answer: (
      <>
        Your NEAR funds are managed within your chosen wallet. To best address your question we suggest you visit the
        support site for your wallet that holds your NEAR funds. For generalized steps see
        <a href={urls.withdrawNearFunds} target="_blank">
          this article
        </a>
        .
      </>
    ),
  },
];

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  gap: 80px;
`;

const Text = styled.p`
  font: var(--${(p) => p.$size ?? "text-base"});
  font-weight: ${(p) => p.$fontWeight} !important;
  color: var(--${(p) => p.$color ?? "currentColor"});
  margin: 0;

  @media (max-width: 900px) {
    font: var(--${(p) => p.$mobileSize ?? p.$size ?? "text-base"});
  }
`;

const Flex = styled.div`
  display: flex;
  gap: ${(p) => p.$gap};
  align-items: ${(p) => p.$alignItems};
  justify-content: ${(p) => p.$justifyContent};
  flex-direction: ${(p) => p.$direction ?? "row"};
  flex-wrap: ${(p) => p.$wrap ?? "nowrap"};

  ${(p) =>
    p.$mobileStack &&
    `
    @media (max-width: 900px) {
      flex-direction: column;
    }
  `}

  @media (max-width: 900px) {
    gap: ${(p) => p.$mobileGap ?? p.$gap};
    align-items: ${(p) => p.$mobileAlignItems ?? p.$alignItems};
  }
`;

const Grid = styled.div`
  display: grid;
  gap: ${(p) => p.$gap};
  grid-template-columns: ${(p) => p.$columns};
  align-items: ${(p) => p.$alignItems};

  @media (max-width: ${(p) => p.$breakpoint ?? "900px"}) {
    grid-template-columns: ${(p) => p.$breakpointColumns ?? "1fr"};
    gap: ${(p) => p.$mobileGap ?? p.$gap};
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  &.faqs {
    a {
      color: var(--violet8);
      font-weight: 700;
    }
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 6px;
  color: var(--${(p) => p.$color ?? "currentColor"});
  background: var(--${(p) => p.$background ?? "sand4"});
`;

const IconTextLink = styled("Link")`
  all: unset;
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  font: var(--text-s);
  font-weight: 700;
  color: currentColor;
  text-decoration: none !important;
  cursor: pointer;
  transition: all 150ms;

  i {
    font-size: 20px;
    color: var(--${(p) => p.$iconColor ?? "currentColor"});
    transition: all 150ms;

    &.ph-caret-right {
      font-size: 16px;
    }
  }

  &:hover,
  &:focus {
    span {
      text-decoration: underline;
      text-underline-offset: 2px;
    }

    i {
      color: currentColor;
    }
  }
`;

function openGleapWidget() {
  emitGatewayEvent &&
    emitGatewayEvent({
      type: "GLEAP",
      action: "OPEN",
    });
}

return (
  <Wrapper className="gateway-page-container">
    <Section>
      <Text $size="text-2xl" $fontWeight="700">
        Get Support
      </Text>

      <Grid $columns="2fr 1fr" $gap="1.5rem">
        <Card $background="green5" $color="green12">
          <Text $size="text-l" $fontWeight="700">
            Have a question? Ask our experts
          </Text>

          <Text>
            NEAR is a global community of Web3 enthusiasts and innovators. Dive into one of our social channels to
            engage in discussion with our lively community.{" "}
          </Text>

          <Text $size="text-s" $fontWeight="700" style={{ textTransform: "uppercase", marginTop: "1.5rem" }}>
            Channels
          </Text>

          <Grid $columns="1fr 1fr 1fr" $gap="1.5rem" $breakpoint="600px" $breakpointColumns="1fr 1fr">
            {channels.map((channel) => (
              <IconTextLink key={channel.url} href={channel.url} target="_blank" $iconColor="green11">
                <i className={`ph-bold ${channel.icon}`} />
                <span>{channel.label}</span>
                <i className="ph ph-caret-right" />
              </IconTextLink>
            ))}
          </Grid>
        </Card>

        <Flex $direction="column" $gap="1.5rem">
          <Card $background="violet5" $color="violet12" style={{ flexGrow: 1 }}>
            <Text>Jump in a voice call with our developers</Text>
            <Text>Thursdays: 11hs & 18hs</Text>

            <IconTextLink href={urls.discord} target="_blank" $iconColor="violet11">
              <i className="ph-bold ph-chat-circle-dots" />
              <span>Join our Discord</span>
            </IconTextLink>
          </Card>

          <Card $background="amber5" $color="amber12" style={{ flexGrow: 1 }}>
            <Text $size="text-l" $fontWeight="700">
              Resolve an issue
            </Text>

            <Text>Get in touch with our customer care team</Text>

            <IconTextLink as="button" $iconColor="amber11" onClick={openGleapWidget}>
              <i className="ph-bold ph-chat-circle-dots" />
              <span>Launch support form</span>
            </IconTextLink>
          </Card>
        </Flex>
      </Grid>
    </Section>

    <Section className="faqs">
      <Text $size="text-2xl" $fontWeight="700">
        FAQ
      </Text>

      <Widget
        src="${REPL_ACCOUNT}/widget/DIG.Accordion"
        props={{
          type: "multiple",
          items: faqs.map((faq) => ({
            value: faq.question,
            header: faq.question,
            content: faq.answer,
          })),
        }}
      />
    </Section>
  </Wrapper>
);

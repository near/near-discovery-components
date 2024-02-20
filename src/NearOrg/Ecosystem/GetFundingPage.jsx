const Wrapper = styled.div`
  --section-gap: 162px;
  --large-gap: 82px;
  --medium-gap: 48px;
  padding: calc(var(--section-gap) / 2) 0 0;
  position: relative;

  @media (max-width: 900px) {
    --section-gap: 60px;
    --large-gap: 48px;
    --medium-gap: 24px;
  }
`;
const H1 = styled.h1`
  font: var(--text-hero);
  text-align: center;
  letter-spacing: -0.015em;
  color: var(--sand12);
  margin: 0;
  max-width: 960px;

  @media (max-width: 900px) {
    font: var(--text-2xl);
    font-weight: 600;
  }
`;

const Text = styled.p`
  font: var(--${(p) => p.size ?? "text-base"});
  font-weight: ${(p) => p.fontWeight};
  color: var(--${(p) => p.color ?? "sand10"});
  margin: 0;
  text-align: ${(p) => p.align};
`;
const Flex = styled.div`
  display: flex;
  gap: ${(p) => p.gap};
  align-items: ${(p) => p.alignItems};
  justify-content: ${(p) => p.justifyContent};
  flex-direction: ${(p) => p.direction ?? "row"};
  flex-wrap: ${(p) => p.wrap ?? "nowrap"};

  @media (max-width: 900px) {
    flex-direction: ${(p) => (p.mobileStack ? "column" : p.direction ?? "row")};
    gap: ${(p) => (p.mobileStack === true ? "var(--section-gap)" : p.mobileStack ? p.mobileStack : p.gap)};
  }
`;
const Section = styled.div`
  display: flex;
  padding: calc(var(--section-gap) / 2);
  gap: ${(p) => p.gap ?? "var(--medium-gap)"};
  flex-direction: column;
  align-items: ${(p) => (p.center ? "center" : undefined)};
  justify-content: ${(p) => (p.center ? "center" : undefined)};
  text-align: ${(p) => (p.center ? "center" : undefined)};
  background: ${(p) => p.background};

  @media (max-width: 900px) {
    padding-left: var(--medium-gap);
    padding-right: var(--medium-gap);
  }
`;
const Card = styled.div`
  display: flex;
  flex-direction: ${(p) => p.direction ?? "column"};
  gap: ${(p) => p.gap ?? "24px"};
  width: 100%;
  padding: ${(p) => p.padding ?? "32px"};
  border-radius: 8px;
  border: ${(p) => p.border ?? "1px solid var(--sand4)"};
  align-items: ${(p) => (p.center ? "center" : "flex-star")};
  justify-content: ${(p) => (p.center ? "center" : undefined)};
  text-align: ${(p) => (p.center ? "center" : undefined)};
  background: ${(p) => p.background ?? "var(--sand1)"};
`;
const SocialIcon = styled.i`
  font-size: ${(p) => p.size ?? "30px"};
  text-align: ${(p) => p.align};
  color: ${(p) => p.color};
`;

function returnIpfsImage(cfid) {
  return {
    ipfs_cid: cfid,
  };
}

const ipfsImages = {
  arrows: "bafkreifdzknpkboed3jmm4rgtbg3mqaocziagtjbznfp6o3hvgd5ix6brm",
  logoAurora: "bafkreieoq7wpdctcx42uywfdaoi4k3uq6rgodbjjz6mhz3qesrmaben2ju",
  logoDevHub: "bafkreif4i3opjuumiq3djbyta74somrjsjzhlvd3zgrhknmh32iv4qgcgi",
  logoGlobeDao: "bafkreih6n3ukibgnb4cge3u44aorabmfvejzlpqjrjl6cnbht5rlegc2cu",
  logoMetaPool: "bafkreicj5zrz2oj2apb5balxtepk32nzxm5t5gywcznr6w2azxkpfd3uye",
  logoNearGamingDAO: "bafkreicpwgvxgjzifbci2omgtlbdail5a7rjpdyrjbpiwfklpwlgvuog7m",
  logoNearWeek: "bafkreiblac35httjgnc2dmn2ym67fb3emwlsvmwp4ky6xvo4fmtreb2dei",
  logoOnboardDao: "bafkreicf2rsgrxi76icaxbegjnxc62uumeqqc23rfxfr67boaht3faoz4i",
  logoPotlock: "bafkreie7kmpb2urjargjp3wh2kkoah26zfa7y52j6s5rnftwuqtm4garkm",
  logoProximity: "bafkreiazqis67kprs5ofbdruktmtvtun4g4bb2nbrqpwxzocuz77io6vyy",
  logoSheNear: "bafkreidlrjnin7ikyepbaontctigs7f6nrltph7jspeavyutbviouj66ua",
  logoHumanGuild: "bafkreia2q267cf7apo6r3o3uw35lpbrp43jb3c5udfgquee2clbkdbks4e",
  logoCypherpunkGuild: "bafkreie25aa7gfb5u3p7bouxc6xknismfgtdtlt3yi7pqau3nqtksvvnsm",
  logoMintBase: "bafkreia3zulk3xrmwc6grqcpxavzug6odwgkwzd5magctxvq4jvalbnkcy",
  logoNDC: "bafkreihmznoqcsq2ivkjck2iqpyaojmmrusma2pqapjwlvop2i7oyoebyu",
  logoOctopus: "bafkreibzcnifufde5ft6hx3qkwzxhzq66avfbholirvrmaf5jbojwqggey",
  logoMetaWeb: "bafkreigalzrrkjyq755e45ryvrpragroneda3373assctbrnwjmgb4fzwe",
  logoOWC: "bafkreiarz2ffdpkuaoz6g7tvbp66lyoqqgwpvxtq3u4won46sjtuds6hqa",
  logoStealthCapital: "bafkreiac7dkdapj6bhiyusqs576is3b36ypbz6dimhugnrrhhv63i7pe6m",
  logoLyric: "bafkreicjhngar5ybinywhql3msk6tqi5cckngaf2zywjeuw65umkoqtq34",
  logoCreativeDao: "bafkreictzvvz2irr7tr7fhkdne2i7xpr4mf7x5b5i2vhgoqdswb73lbyyu",
  logoDevDao: "bafkreibvh3qys5z7qbekqqhmgump4iy32nw5wfvcyegejfs4gckrbqp7pq",
  logoMarketingDao: "bafkreifnwvfi7x5bzzxrjjvp7xbfqd3xpojtlohcgzrowtvyygogrt2emq",
  logoToronto: "bafkreiftfra7wwdwivl2w4v6or6dwycjpswhpjnxxdr7nuhrfnlippxc34",
  logoAfrica: "bafkreiblt2ydxlgfywigkpsl2uon24fhayozfcbdlzcokkf57eaehpqehu",
  logoKorea: "bafkreifvp5gfpxmavmmcdh7ni2e7zpmggs7xdltiuwbhbsvrxoqn4hm7oi",
  flagKenia: "bafkreib4flzpg3emzmsyw2dro5hcnsnqqfrfk7gd2dvvsjks2xcvo5rbxa",
  logoIndia: "bafkreifn2vipi5tq43z5mmbbplrhedeuoh7c2w6d73kfxbdlzbzu4waava",
  flagBalcans: "bafkreicz6eqbngpv44endjeddfudaaooyw63iuzgmlog4stzrnpdkje4vi",
  logoVietnam: "bafkreibbtoqgmygctqgx4n4ofqhm635p7km4f3q5mwb6w2pj3j3l5l3dkq",
  flagSouthKorea: "bafkreifirmndyjemruy56lgitls4c2tpee5rkx6t26u7lyuatyuywmevki",
  flagUSA: "bafkreicsmgaejlbmzvfbawdayiqljbxzi62tmvvktoveubuljijib6ezd4",
  longImage: "bafkreic7dun4novdzgca54pwisa6otg3yut45jbnfyof2bop4xsnl22bo4",
};

const fundingCards = [
  {
    key: "ecosystem_grants",
    iconClassName: "ph ph-circles-three-plus",
    iconColor: "violet7",
    content: "Ecosystem Grants",
  },
  {
    key: "accelerators_and_incubators",
    iconClassName: "ph ph-trend-up",
    iconColor: "violet8",
    content: "Accelerators & Incubators",
  },
  {
    key: "community_led_dao",
    iconClassName: "ph ph-users-four",
    iconColor: "red7",
    content: "Community-led DAOs",
  },
  {
    key: "regional_hubs",
    iconClassName: "ph ph-planet",
    iconColor: "cyan7",
    content: "Regional hubs",
  },
];
const ecosystemGrantCards = [
  {
    ipfsImage: ipfsImages.logoNDC,
    title: "Near Digital Collective",
    content: "The NDC empowers builders to create sustainable impact in Web3",
    href: "https://t.me/ndc_newsstream_chat",
  },
  {
    ipfsImage: ipfsImages.logoDevHub,
    title: "DevHub",
    content: "Funding & support for developers & builders",
    href: "https://${REPL_NEAR_URL}/devhub.near/widget/app",
  },
  {
    ipfsImage: ipfsImages.logoPotlock,
    title: "Potlock",
    content: "Decentralized public goods funding",
    href: "https://app.potlock.org/",
  },
  {
    ipfsImage: ipfsImages.logoMetaPool,
    title: "MetaPool Grants",
    content: "For MetaPool growth initiatives focused on Defi, Education, TVL Generation, and Brand Awareness",
    href: "https://docs.metapool.app/master/meta-pool-ecosystem/vote/grants",
  },
  {
    ipfsImage: ipfsImages.logoSheNear,
    title: "She is Near",
    content: "Comprehensive support for women-led projects and Web3 influencers",
    href: "https://gov.near.org/c/community/she-is-near/145",
  },
  {
    ipfsImage: ipfsImages.logoGlobeDao,
    title: "Globe DAO",
    content: "Supports regional projects and communities with resources and collaboration",
    href: "https://gov.near.org/c/community/globe/112",
  },
  {
    ipfsImage: ipfsImages.logoAurora,
    title: "Aurora",
    content: "Aimed at projects looking to build on the Aurora EVM",
    href: "https://aurora.dev/grants",
  },
  {
    ipfsImage: ipfsImages.logoProximity,
    title: "Proximity Labs",
    content: "Aimed at supporting projects focused on DeFi",
    href: "https://www.proximity.dev",
  },
  {
    ipfsImage: ipfsImages.logoMintBase,
    title: "Mintbase",
    content: "Aimed at supporting projects building in NFTs",
    href: "https://github.com/mintbase/Grants-Program#1-application",
  },
  {
    ipfsImage: ipfsImages.logoHumanGuild,
    title: "Human Guild",
    content: "Aimed at supporting projects building in Gaming",
    href: "https://humanguild.io",
  },
  {
    ipfsImage: ipfsImages.logoCypherpunkGuild,
    title: "Cypherpunk Guild",
    content: "Aimed at supporting projects building in Privacy",
    href: "https://cypherpunkguild.medium.com/cypherpunk-guild-grant-program-d0ed5769b6b9",
  },
];
const acceleratorsCards = [
  {
    ipfsImage: ipfsImages.logoLyric,
    title: "Lyric Ventures",
    content: "An incubator focused on B2B projects",
    href: "https://lyrik.ventures",
  },
  {
    ipfsImage: ipfsImages.logoMetaWeb,
    title: "MetaWeb",
    content: "Venture capital and Incubator",
    href: "https://www.metaweb.vc",
  },
  {
    ipfsImage: ipfsImages.logoNearWeek,
    title: "NEARWEEK",
    content: "Amplification of twitter posts, newsletters, marketing campaigns, etc.",
    href: "https://nearweek.com/",
  },
  {
    ipfsImage: ipfsImages.logoOctopus,
    title: "Octopus Accelerator",
    content: "Web3 accelerator for projects building appchains",
    href: "https://accelerator.oct.network",
  },
  {
    ipfsImage: ipfsImages.logoOWC,
    title: "OWC",
    content: "Web3 accelerator",
    href: "https://www.openwebcollective.com",
  },
  {
    ipfsImage: ipfsImages.logoStealthCapital,
    title: "Stealth Capital",
    content: "An investment fund",
    href: "https://www.stealthcap.io",
  },
];
const communityDaoCards = [
  {
    ipfsImage: ipfsImages.logoNearGamingDAO,
    title: "Near Gaming DAO",
    content: "Focused on the development of the NEAR gaming ecosystem",
    href: "https://gov.near.org/c/community/gaming/146",
  },
  {
    ipfsImage: ipfsImages.logoOnboardDao,
    title: "Onboard DAO",
    content: "Supporting collaboration & development of wallet and onboarding infrastructure",
    href: "https://onboarddao.super.site/funding-guide-onboard-dao",
  },
  {
    ipfsImage: ipfsImages.logoMarketingDao,
    title: "Marketing DAO",
    content:
      "Grants for marketing support initiatives providing comprehensive founders support via PR agency, influencers, working hours, building marketing strategies and more",
    href: "https://${REPL_NEAR_URL}/ndcdev.near/widget/MDAO.App?page=home",
  },
  {
    ipfsImage: ipfsImages.logoCreativeDao,
    title: "Creative DAO",
    content: "Funding for creative projects, guilds and DAOs",
    href: "https://gov.near.org/c/creatives/creatives-dao/61?_gl=1*1fhalxr*_ga*OTkzODQ3NDEwLjE2NzI4MjM3NjE.*_ga_9GWCXQJ62J*MTY3MjkxMDg2My40LjAuMTY3MjkxMDg2My4wLjAuMA..",
  },
  {
    ipfsImage: ipfsImages.logoDevHub,
    title: "DevHub",
    content: "The decentralized home base for NEAR builders",
    href: "https://near.org/devhub.near/widget/app",
  },
];
const regionalHubCards = [
  {
    ipfsImage: ipfsImages.flagKenia,
    title: "Kenya",
    href: "https://sankore2.com",
  },
  {
    ipfsImage: ipfsImages.flagBalcans,
    title: "Balkans",
    href: "https://nearbalkans.org",
  },
  {
    ipfsImage: ipfsImages.flagUSA,
    title: "Bayan",
    href: "https://twitter.com/Banyan_NEAR",
  },
  {
    ipfsImage: ipfsImages.logoIndia,
    title: "India",
    href: "https://twitter.com/NearIndia",
  },
  {
    ipfsImage: ipfsImages.logoVietnam,
    title: "Vietnam",
    href: "https://nearvietnamhub.org",
  },
  {
    ipfsImage: ipfsImages.logoKorea,
    title: "Korea",
    href: "https://twitter.com/NearKoreaHub",
  },
  {
    ipfsImage: ipfsImages.logoAfrica,
    title: "Africa",
    href: "https://twitter.com/nearafrica_",
  },
  {
    ipfsImage: ipfsImages.logoToronto,
    title: "Toronto",
    href: "https://twitter.com/NEAR_Toronto",
  },
];

const infrastructure = [
  {
    ipfsImage: ipfsImages.logoCreativeDao,
    title: "NEAR Dev Telegram Group",
    content: "NEAR Developers community chat. Share your knowledge and live on the cutting edge of NEAR!",
    href: "https://t.me/neardev",
  },
  {
    ipfsImage: ipfsImages.logoDevHub,
    title: "DevHub",
    content: "The decentralized home base for NEAR builders",
    href: "https://near.org/devhub.near/widget/app",
  },
];

const fundingHugeCards = [
  {
    key: "ecosystem_grants_huge_card",
    id: "ecosystem_grants",
    iconClassName: "ph ph-circles-three-plus",
    iconColor: "violet7",
    title: "Ecosystem Grants",
    content: "For projects and start-ups building in web 3.0",
    cards: ecosystemGrantCards,
  },
  {
    key: "accelerators_and_incubators_huge_card",
    id: "accelerators_and_incubators",
    iconClassName: "ph ph-trend-up",
    iconColor: "violet8",
    title: "Accelerators and Incubators",
    content: "For projects and start-ups looking to join an incubator or accelerator",
    cards: acceleratorsCards,
  },
  {
    key: "community_led_dao_huge_card",
    id: "community_led_dao",
    iconClassName: "ph ph-users-four",
    iconColor: "red7",
    title: "Community-led DAOs",
    content: "Decentralized communities that support the growth of the ecosystem",
    cards: communityDaoCards,
  },
  {
    key: "regional_hubs_huge_card",
    id: "regional_hubs",
    iconClassName: "ph ph-planet",
    iconColor: "cyan7",
    title: "Regional hubs",
    content: "If a project is based in the following regions they should apply via their respective Regional Hub.",
    cards: regionalHubCards,
  },
];

return (
  <>
    <Wrapper className="container-xl">
      <Section center>
        <Flex gap="16px" direction="column" alignItems="center">
          <H1>Get Funded. Build the Future.</H1>
          <Text size="text-xl" color="sand12" style={{ maxWidth: "662px" }}>
            The NEAR ecosystem offers multiple funding options to support initiatives aimed at decentralizing, growing,
            and innovating on NEAR.
          </Text>
        </Flex>
      </Section>

      <Section center>
        <Flex gap="16px" direction="column" alignItems="stretch" style={{ width: "100%" }}>
          <Text size="text-3xl" color="sand12">
            Funding sources
          </Text>
          <Text size="text-xl" color="sand12">
            We’ve helped hundreds of projects and teams realize their ideas, and bring them to market.
          </Text>
          <Widget
            src="${REPL_MOB}/widget/Image"
            props={{
              image: returnIpfsImage(ipfsImages.arrows),
              className: "img-fluid d-none d-lg-block mx-auto",
              style: { maxWidth: "1000px" },
            }}
          />
          <div className="row row-cols-lg-4 row-cols-md-2 row-cols-1 g-4">
            {fundingCards.map((item) => (
              <div className="col" key={item.key}>
                <Card center>
                  <Link href={`#${item.key}`}>
                    <SocialIcon className={item.iconClassName} color={`var(--${item.iconColor})`} />
                    <Text size="text-m" color="sand12">
                      {item.content}
                    </Text>
                  </Link>
                </Card>
              </div>
            ))}
          </div>
        </Flex>
      </Section>

      <Section gap="32px">
        {fundingHugeCards.map((card) => (
          <Card center key={card.key} id={card.id}>
            <SocialIcon className={card.iconClassName} color={`var(--${card.iconColor})`} size="32px" />
            <Text size="text-3xl" color="sand12">
              {card.title}
            </Text>
            <Text size="text-l" color="sand12">
              {card.content}
            </Text>
            <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1 g-4 justify-content-center">
              {card.cards.map((item) => (
                <div className="col" key={item.ipfsImage}>
                  <Card background="transparent" border="none" direction="row">
                    <Widget
                      src="${REPL_MOB}/widget/Image"
                      props={{
                        image: returnIpfsImage(item.ipfsImage),
                        className: "img-fluid",
                        style: {
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                        },
                      }}
                    />
                    <Flex gap="16px" direction="column" alignItems="start">
                      <Text size="text-l" color="sand12" fontWeight="600" align="left">
                        {item.title}
                      </Text>
                      {item.content && (
                        <Text size="text-m" color="sand12" align="left">
                          {item.content}
                        </Text>
                      )}
                      {item.href ? (
                        <div>
                          <Widget
                            src="${REPL_ACCOUNT}/widget/DIG.Button"
                            props={{
                              href: item.href,
                              iconRight: "ph-bold ph-arrow-up-right",
                              label: "Learn more",
                              variant: "primary",
                              fill: "outline",
                              size: "small",
                              target: "_blank",
                            }}
                          />
                        </div>
                      ) : (
                        <Text size="text-m" color="sand12" align="left" fontWeight="600">
                          Comming Soon
                        </Text>
                      )}
                    </Flex>
                  </Card>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </Section>

      <Section center>
        <Text size="text-3xl" color="sand12">
          What funding program is best for me?
        </Text>
        <Text size="text-xl" color="sand12" style={{ maxWidth: "662px" }}>
          There are several options to get financial support for your idea – whether it is a grant from an ecosystem
          fund, joining an accelerator, or getting venture support through our Ecosystem partners.
        </Text>
        <Widget
          src="${REPL_MOB}/widget/Image"
          props={{
            image: returnIpfsImage(ipfsImages.longImage),
            className: "img-fluid",
            style: {
              maxWidth: "800px",
              height: "auto",
            },
          }}
        />
        <div>
          <Widget
            src="${REPL_ACCOUNT}/widget/DIG.Button"
            props={{
              href: `https://www.nearbuilders.com/`,
              label: "Explore All Teams",
              variant: "affirmative",
              size: "large",
            }}
          />
        </div>
      </Section>
    </Wrapper>

    <Widget src="${REPL_ACCOUNT}/widget/NearOrg.Footer" />
  </>
);

let totalComponents = 0;
const imageRatio = 590 / 327;

const componentsData = Social.keys("*/widget/*", "final", {
  return_type: "BlockHeight",
});

if (componentsData) {
  Object.keys(componentsData).forEach((accountId) => {
    totalComponents += Object.keys(componentsData[accountId].widget).length;
  });
}

const ipfsImages = {
  textArrow: "bafkreidcvglzeenk2wd6y2gh5skiuc62fcdvo3qikjosejobclcekaqwru",
  logos: {
    aurora: "bafkreidgbgeghpr257xhlaqkzdnsoigjgbdhf3exe5iw23h2bniipe7dwe",
    calimero: "bafkreifmztxlff3sxt2psgfm7vjo22xhyfiyjyp7sn3npcncfhck45f6ky",
    octopusNetwork:
      "bafkreiakazav5ddhr2fxdesqrv7vphraybp5u6lkdh6tcavgrkbpm5vtt4",
    pagoda: "bafkreieetpcono7u3n6j44bbrdvsxasmki7rtmvax53p4jf3einzdaudr4",
    proximity: "bafkreidk3cmyrxvi64mdp7i6ut5demlpxe6sbog42qnssume7ijqdfumze",
    sweatcoin: "bafkreidevsjnb5knn4h6cavxrkqvvirh7ukj574womlhgfkt4i4bxkpp4i",
  },
};

const web3Teams = [
  {
    url: "https://www.pagoda.co",
    name: "Pagoda",
    ipfsImage: ipfsImages.logos.pagoda,
  },
  {
    url: "https://aurora.dev",
    name: "Aurora",
    ipfsImage: ipfsImages.logos.aurora,
  },
  {
    url: "https://www.calimero.network",
    name: "Calimero",
    ipfsImage: ipfsImages.logos.calimero,
  },
  {
    url: "https://www.proximity.dev",
    name: "Proximity",
    ipfsImage: ipfsImages.logos.proximity,
  },
  {
    url: "https://sweatco.in",
    name: "Sweatcoin",
    ipfsImage: ipfsImages.logos.sweatcoin,
  },
  {
    url: "https://oct.network",
    name: "Octopus Network",
    ipfsImage: ipfsImages.logos.octopusNetwork,
  },
];

function returnIpfsImage(cfid) {
  return {
    ipfs_cid: cfid,
  };
}

const Wrapper = styled.div`
  --section-gap: 162px;
  --large-gap: 82px;
  --medium-gap: 48px;
  margin: calc(var(--body-top-padding) * -1) calc(var(--bs-gutter-x) * -0.5) 0;
  padding: calc(var(--section-gap) / 2) 0;

  @media (max-width: 900px) {
    --section-gap: 60px;
    --large-gap: 48px;
    --medium-gap: 24px;
    padding-top: 0;
  }
`;

const H1 = styled.h1`
  font: var(--text-hero);
  text-align: center;
  letter-spacing: -0.015em;
  color: var(--sand12);
  margin: 0;

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

  [href] {
    color: var(--violet8);
    &:hover {
      color: var(--violet11);
      text-decoration: none;
    }
    &:focus {
      text-decoration: underline;
      outline: none;
    }
  }

  ${(p) =>
    p.flex &&
    `
    display: flex;
    align-items: center;
    gap: 16px;
  `}
`;

const Flex = styled.div`
  display: flex;
  gap: ${(p) => p.gap};
  align-items: ${(p) => p.alignItems};
  justify-content: ${(p) => p.justifyContent};
  flex-direction: ${(p) => p.direction ?? "row"};
  flex-wrap: ${(p) => p.wrap ?? "nowrap"};

  ${(p) =>
    p.mobileStack &&
    `
    @media (max-width: 900px) {
      flex-direction: column;
      gap: var(--section-gap);
    }
  `}
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

const LogoLink = styled.a`
  display: block;
  height: 28px;
  color: var(--sand10);

  img {
    display: block;
    height: 100%;
  }
`;

const VerticalBorder = styled.div`
  height: 82px;
  width: 1px;
  background: linear-gradient(to bottom, var(--violet1), var(--violet10));
`;

const Icon = styled.div`
  display: inline-flex;
  width: 64px;
  height: 64px;
  border-radius: 100%;
  align-items: center;
  justify-content: center;
  color: ${(p) => `var(--${p.color})` ?? "var(--sand10)"};
  background: ${(p) => `var(--${p.backgroundColor})` ?? "var(--sand3)"};
  border: 1px solid ${(p) => `var(--${p.borderColor})` ?? "var(--sand5)"};

  i {
    font-size: 28px;
    line-height: 28px;
  }
`;

const OpenArrowText = styled.span`
  img {
    display: none;
  }

  @media (min-width: 900px) {
    color: var(--green8);
    display: inline-block;
    position: relative;
    margin-right: -2.2em;
    right: -0.9em;
    top: -1.4em;
    transform: rotate(5deg);

    img {
      display: block;
      width: 52px;
      position: absolute;
      left: -42px;
      top: 16px;
    }
  }
`;

const ContentWithImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--large-gap);

  &:nth-child(odd) {
    flex-direction: ${(p) => (p.alternate ? "row-reverse" : undefined)};
  }

  @media (max-width: 900px) {
    flex-direction: column !important;
  }
`;

const ContentWithImage_Image = styled.div`
  overflow: hidden;
  border-radius: 6px;
  border: 1px solid var(--sand5);
  width: 100%;

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

const ContentBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--medium-gap);
  width: 100%;
`;

const ContentBlock_Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Develop = styled.div`
  display: flex;
  width: 100%;
  gap: var(--medium-gap);
  align-items: center;
  flex-direction: column;
`;

const Develop_TabButton = styled.button`
  all: unset;
  display: inline-block;
  font: inherit;
  color: ${(p) => `var(--${p.color})`};
  transition: all 200ms;
  border-bottom: 2px solid
    ${(p) => (p.active ? `var(--${p.color})` : "hsla(0, 0%, 100%, 0)")};
  box-shadow: 0 0 0 0px var(--violet4);

  &:hover {
    border-color: ${(p) => `var(--${p.color})`};
  }
  &:focus {
    box-shadow: 0 0 0 4px var(--violet4);
  }
`;

const Develop_Preview = styled.div`
  width: 100%;
  height: 200px;
  line-height: 200px;
  background: var(--sand6);
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--medium-gap);
  padding: var(--medium-gap);
  text-align: center;
  background: var(--sand2);

  @media (max-width: 800px) {
    gap: var(--large-gap);
    padding: var(--large-gap);
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.gap ?? "24px"};
  width: 100%;
  padding: 32px;
  border-radius: 8px;
  border: 1px solid var(--sand4);
  align-items: ${(p) => (p.center ? "center" : "flex-star")};
  justify-content: ${(p) => (p.center ? "center" : undefined)};
  text-align: ${(p) => (p.center ? "center" : "left")};
  background: var(--sand1);
`;

return (
  <Wrapper>
    <Section center>
      <Flex gap="16px" direction="column" alignItems="center">
        <H1>Build the Open Web</H1>

        <Text size="text-l" style={{ maxWidth: "662px" }}>
          NEAR is the blockchain operating system – empowering developers to
          effortlessly compose, publish, and distribute new and innovative
          applications on the decentralized web.
        </Text>
      </Flex>

      <Flex gap="24px" wrap="wrap" justifyContent="center">
        <Widget
          src="near/widget/DIG.Button"
          props={{
            href: "#todo",
            iconLeft: "ph-duotone ph-user-plus",
            label: "Create Account",
            variant: "secondary",
            size: "large",
          }}
        />
        <Widget
          src="near/widget/DIG.Button"
          props={{
            href: "/edit",
            iconLeft: "ph-duotone ph-code-block",
            label: "Try It First",
            variant: "affirmative",
            size: "large",
          }}
        />
      </Flex>
    </Section>

    <Section center>
      <Text
        size="text-xs"
        fontWeight="600"
        style={{ textTransform: "uppercase", letterSpacing: "0.17em" }}
      >
        Trusted by Web3’s MOST innovative teams
      </Text>

      <Flex gap="var(--large-gap)" wrap="wrap" justifyContent="center">
        {web3Teams.map((team) => {
          return (
            <LogoLink href={team.url} target="_blank" title={team.name}>
              <Widget
                src="mob.near/widget/Image"
                props={{
                  image: returnIpfsImage(team.ipfsImage),
                  alt: team.name,
                }}
              />
            </LogoLink>
          );
        })}
      </Flex>
    </Section>

    <Section center>
      <Flex gap="16px" direction="column" alignItems="center">
        <Text as="h2" size="text-l" fontWeight="600" color="violet10">
          Platform
        </Text>
        <VerticalBorder />
        <Text
          size="text-2xl"
          fontWeight="600"
          color="sand12"
          style={{ maxWidth: "430px" }}
        >
          Your toolkit for the
          <OpenArrowText>
            <Widget
              src="mob.near/widget/Image"
              props={{
                image: returnIpfsImage(ipfsImages.textArrow),
              }}
            />
            Open
          </OpenArrowText>
          Web.
        </Text>
      </Flex>

      <Text size="text-2xl" fontWeight="500" style={{ maxWidth: "550px" }}>
        Get building in seconds on a new decentralized foundation, all with the
        tools you know and love.
      </Text>
    </Section>

    <Section gap="var(--section-gap)">
      <ContentWithImage alternate>
        <ContentBlock>
          <Icon color="green12" backgroundColor="green4" borderColor="green9">
            <i className="ph-duotone ph-plugs-connected" />
          </Icon>
          <ContentBlock_Text>
            <Text size="text-xl" fontWeight="600" color="sand12">
              Truly Plug & Play
            </Text>
            <Text>
              Why invest before you’re invested? Enjoy frictionless onboarding
              for both you and your users.{" "}
              <Text as="span" fontWeight="600" color="sand12">
                No crypto required.
              </Text>
            </Text>
          </ContentBlock_Text>
          <Widget
            src="near/widget/DIG.Button"
            props={{
              href: "#todo",
              iconLeft: "ph-bold ph-fingerprint-simple",
              label: "Try Fast Auth",
              variant: "secondary",
              size: "large",
            }}
          />
        </ContentBlock>

        <ContentWithImage_Image>
          <AspectRatio.Root ratio={imageRatio}>
            <img src="https://images.unsplash.com/photo-1678845750026-0b9936b4202c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3774&q=80" />
          </AspectRatio.Root>
        </ContentWithImage_Image>
      </ContentWithImage>

      <ContentWithImage alternate>
        <ContentBlock>
          <Icon color="amber11" backgroundColor="amber4" borderColor="amber9">
            <i className="ph-duotone ph-plugs-connected" />
          </Icon>
          <ContentBlock_Text>
            <Text size="text-xl" fontWeight="600" color="sand12">
              Build Your Way
            </Text>
            <Text>
              Avoid spending time learning proprietary languages that inhibit
              your productivity.{" "}
              <Text as="a" href="https://docs.near.org/sdk/js/introduction">
                Build faster with Javascript
              </Text>
              , in confidence with Rust, or in any language that compiles to
              Assembly.
            </Text>
          </ContentBlock_Text>
          <Widget
            src="near/widget/DIG.Button"
            props={{
              href: "https://docs.near.org/sdk/js/introduction",
              iconLeft: "ph-bold ph-book-open-text",
              label: "Read the Docs",
              variant: "secondary",
              size: "large",
            }}
          />
        </ContentBlock>

        <ContentWithImage_Image>
          <AspectRatio.Root ratio={imageRatio}>
            <img src="https://images.unsplash.com/photo-1678845750026-0b9936b4202c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3774&q=80" />
          </AspectRatio.Root>
        </ContentWithImage_Image>
      </ContentWithImage>

      <ContentWithImage alternate>
        <ContentBlock>
          <Icon color="red11" backgroundColor="red3" borderColor="red5">
            <i className="ph-duotone ph-graph" />
          </Icon>
          <ContentBlock_Text>
            <Text size="text-xl" fontWeight="600" color="sand12">
              Data, Decentralized
            </Text>
            <Text>
              Data stored on NEAR is accessible to any component or application
              on the platform, providing a level playing field for developers
              and a more consistent experience for users.
            </Text>
          </ContentBlock_Text>
          <Widget
            src="near/widget/DIG.Button"
            props={{
              href: "#todo",
              iconRight: "ph-bold ph-arrow-up-right",
              label: "Learn More",
              variant: "secondary",
              size: "large",
            }}
          />
        </ContentBlock>

        <ContentWithImage_Image>
          <AspectRatio.Root ratio={imageRatio}>
            <img src="https://images.unsplash.com/photo-1678845750026-0b9936b4202c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3774&q=80" />
          </AspectRatio.Root>
        </ContentWithImage_Image>
      </ContentWithImage>
    </Section>

    <Section center>
      <Develop>
        <Flex gap="16px" direction="column" alignItems="center">
          <Text as="h2" size="text-l" fontWeight="600" color="violet10">
            Develop
          </Text>
          <VerticalBorder />
          <Text size="text-2xl" fontWeight="600" color="sand12">
            Don’t reinvent the wheel. Reinvent
            <span style={{ color: "var(--sand9)" }}>
              <Develop_TabButton active color="red10">
                social
              </Develop_TabButton>
              {`, `}
              <Develop_TabButton color="violet10">gaming</Develop_TabButton>
              {`, `}
              <Develop_TabButton color="green10">finance</Develop_TabButton>
            </span>
          </Text>
        </Flex>

        <Text size="text-2xl" fontWeight="500" style={{ maxWidth: "800px" }}>
          Weave new experiences with over{" "}
          <span style={{ color: "var(--sand12)" }}>{totalComponents}</span> Open
          Web Components built on shared, persistent data.
        </Text>

        <Develop_Preview>(Component Preview)</Develop_Preview>
      </Develop>
    </Section>

    <Section>
      <Flex gap="var(--large-gap)" mobileStack>
        <ContentBlock>
          <Icon
            color="violet11"
            backgroundColor="violet3"
            borderColor="violet5"
          >
            <i className="ph-duotone ph-shapes" />
          </Icon>
          <ContentBlock_Text>
            <Text size="text-xl" fontWeight="600" color="sand12">
              Composable to the Core
            </Text>
            <Text>
              Explore a host of components built by our community. Use them in
              your applications, combine them in new and interesting ways, or
              build and publish your own.
            </Text>
          </ContentBlock_Text>
          <Widget
            src="near/widget/DIG.Button"
            props={{
              href: "/near/widget/ComponentsPage",
              iconRight: "ph-bold ph-arrow-up-right",
              label: "Explore Components",
              variant: "secondary",
              size: "large",
            }}
          />
        </ContentBlock>

        <ContentBlock>
          <Icon color="red11" backgroundColor="red3" borderColor="red5">
            <i className="ph-duotone ph-keyhole" />
          </Icon>
          <ContentBlock_Text>
            <Text size="text-xl" fontWeight="600" color="sand12">
              Always Open Source
            </Text>
            <Text>
              Every component, including this page, is live on NEAR&apos;s
              public blockchain. The source code is available to everyone,
              waiting to be inspected, forked, modified and reused.
            </Text>
          </ContentBlock_Text>
          <Widget
            src="near/widget/DIG.Button"
            props={{
              href: "/edit/near/widget/NearOrg.HomePage",
              iconLeft: "ph-bold ph-git-fork",
              label: "Fork This Page",
              variant: "secondary",
              size: "large",
            }}
          />
        </ContentBlock>
      </Flex>
    </Section>

    <Section style={{ paddingLeft: 0, paddingRight: 0 }}>
      <Stats>
        <div>
          <Text size="text-3xl" color="violet9" fontWeight="500">
            781
          </Text>
          <Text size="text-l" fontWeight="500">
            Active Developers
          </Text>
        </div>
        <div>
          <Text size="text-3xl" color="violet9" fontWeight="500">
            {totalComponents}
          </Text>
          <Text size="text-l" fontWeight="500">
            OS Components
          </Text>
        </div>
        <div>
          <Text size="text-3xl" color="violet9" fontWeight="500">
            100%
          </Text>
          <Text size="text-l" fontWeight="500">
            Uptime
          </Text>
        </div>
      </Stats>
    </Section>

    <Section center>
      <Flex gap="16px" direction="column" alignItems="center">
        <Text as="h2" size="text-l" fontWeight="600" color="violet10">
          Publish
        </Text>
        <VerticalBorder />
        <Text
          size="text-2xl"
          fontWeight="600"
          color="sand12"
          style={{ maxWidth: "420px" }}
        >
          Ditch traditional hosting. Serve straight to your users.
        </Text>
      </Flex>

      <Text size="text-2xl" fontWeight="500" style={{ maxWidth: "550px" }}>
        Publish, store, and host your front-end directly on chain, in an
        instant.
      </Text>
    </Section>

    <Section gap="var(--section-gap)">
      <ContentWithImage>
        <ContentBlock>
          <Icon color="green12" backgroundColor="green4" borderColor="green9">
            <i className="ph-duotone ph-butterfly" />
          </Icon>
          <ContentBlock_Text>
            <Text size="text-xl" fontWeight="600" color="sand12">
              Distribute freely...
            </Text>
            <Text>
              No more jumping through hoops to reach your audience. Your code is
              stored and hosted on chain and served directly to users,
              eliminating reliance on providers and intermediaries.
            </Text>
          </ContentBlock_Text>
          <Widget
            src="near/widget/DIG.Button"
            props={{
              href: "#todo",
              iconLeft: "ph-duotone ph-play",
              label: "Try It Out",
              variant: "secondary",
              size: "large",
            }}
          />
        </ContentBlock>

        <ContentWithImage_Image>
          <AspectRatio.Root ratio={imageRatio}>
            <img src="https://images.unsplash.com/photo-1678845750026-0b9936b4202c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3774&q=80" />
          </AspectRatio.Root>
        </ContentWithImage_Image>
      </ContentWithImage>

      <ContentWithImage>
        <ContentBlock>
          <Icon
            color="violet11"
            backgroundColor="violet3"
            borderColor="violet5"
          >
            <i className="ph-duotone ph-currency-eth" />
          </Icon>
          <ContentBlock_Text>
            <Text size="text-xl" fontWeight="600" color="sand12">
              ...on any chain...
            </Text>
            <Text>
              Deploy your app to Ethereum, Cosmos, and more. Take full advantage
              of NEAR’s speed, low cost and scalability, all while meeting your
              users where they are.
            </Text>
          </ContentBlock_Text>
          <Widget
            src="near/widget/DIG.Button"
            props={{
              href: "#todo",
              iconRight: "ph-bold ph-arrow-up-right",
              label: "Learn More",
              variant: "secondary",
              size: "large",
            }}
          />
        </ContentBlock>

        <ContentWithImage_Image>
          <AspectRatio.Root ratio={imageRatio}>
            <img src="https://images.unsplash.com/photo-1678845750026-0b9936b4202c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3774&q=80" />
          </AspectRatio.Root>
        </ContentWithImage_Image>
      </ContentWithImage>

      <ContentWithImage>
        <ContentBlock>
          <Icon color="red11" backgroundColor="red3" borderColor="red5">
            <i className="ph-duotone ph-globe-hemisphere-west" />
          </Icon>
          <ContentBlock_Text>
            <Text size="text-xl" fontWeight="600" color="sand12">
              ...on any platform, anywhere.
            </Text>
            <Text>
              Any browser, app, or connected device capable of running a few
              lines of Javascript can run your application within an embeded
              blockchain experience.
            </Text>
          </ContentBlock_Text>
          <Widget
            src="near/widget/DIG.Button"
            props={{
              href: "#todo",
              iconLeft: "ph-bold ph-door-open",
              label: "Explore Gateways",
              variant: "secondary",
              size: "large",
            }}
          />
        </ContentBlock>

        <ContentWithImage_Image>
          <AspectRatio.Root ratio={imageRatio}>
            <img src="https://images.unsplash.com/photo-1678845750026-0b9936b4202c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3774&q=80" />
          </AspectRatio.Root>
        </ContentWithImage_Image>
      </ContentWithImage>
    </Section>

    <Section center>
      <Flex gap="16px" direction="column" alignItems="center">
        <Text as="h2" size="text-l" fontWeight="600" color="violet10">
          Discover
        </Text>
        <VerticalBorder />
        <Text
          size="text-2xl"
          fontWeight="600"
          color="sand12"
          style={{ maxWidth: "420px" }}
        >
          Learn, connect, & collaborate!
        </Text>
      </Flex>

      <Text size="text-2xl" fontWeight="500" style={{ maxWidth: "660px" }}>
        Join a vibrant community of builders and innovators cultivating a more
        Open Web.
      </Text>
    </Section>

    <Section>
      <Flex gap="var(--large-gap)" mobileStack>
        <Card>
          <Text size="text-xl" fontWeight="600" color="green8" flex>
            <i className="ph-duotone ph-users-three" />
            Community
          </Text>
          <Text>
            Find the right people to help you on your journey across the
            ecosystem.
          </Text>
          <Widget
            src="near/widget/DIG.Button"
            props={{
              href: "/near/widget/PeoplePage",
              iconRight: "ph-bold ph-arrow-up-right",
              label: "Explore Community",
              variant: "secondary",
              size: "large",
            }}
          />
        </Card>

        <Card>
          <Text size="text-xl" fontWeight="600" color="red10" flex>
            <i className="ph-duotone ph-calendar-blank" />
            Events
          </Text>
          <Text>
            Join us at conferences, meetups, and more as we gather across the
            globe.
          </Text>
          <Widget
            src="near/widget/DIG.Button"
            props={{
              href: "/",
              iconRight: "ph-bold ph-calendar-blank",
              label: "All Events",
              variant: "secondary",
              size: "large",
            }}
          />
        </Card>
      </Flex>
    </Section>
  </Wrapper>
);

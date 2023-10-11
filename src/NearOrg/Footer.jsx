const Wrapper = styled.div`
  background: var(--white);
  padding: 100px 24px;
`;

const Text = styled.p`
  font-family: "FK Grotesk", sans-serif;
  font-size: ${(p) => p.size ?? "18px"};
  line-height: ${(p) => p.lineHeight ?? "1.5"};
  font-weight: ${(p) => p.weight ?? "400"};
  color: ${(p) => p.color ?? "#000"};
  margin: 0;
`;

const Container = styled.div`
  display: grid;
  gap: 100px;
  max-width: 1040px;
  margin: 0 auto;
`;

const LinkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 34px;

  div {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  ul {
    display: grid;
    list-style: none;
    gap: 8px;
    margin: 0;
    padding: 0;
  }

  a {
    font-family: "FK Grotesk", sans-serif;
    font-size: 14px;
    line-height: 1.2;
    font-weight: 400;
    color: var(--sand11);
    white-space: nowrap;

    &:hover,
    &:focus,
    &:active {
      color: var(--sand12);
      text-decoration: underline;
      outline: none;
    }
  }

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

const Logo = styled.div`
  height: 32px;
  svg {
    height: 100%;
  }
`;

const Bottom = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-right: 2.85rem;

  @media (max-width: 1100px) {
    padding-right: 0;
  }
`;

const sections = [
  {
    title: "Platform",
    links: [
      {
        title: "Decentralized Front-Ends",
        url: "https://docs.near.org/bos/components",
      },
      {
        title: "Decentralized Hosting",
        url: "https://docs.near.org/bos/tutorial/bos-gateway",
      },
      {
        title: "Data Platform",
        url: "https://docs.near.org/concepts/data-flow/data-storage",
      },
      {
        title: "Fast Auth",
        url: "https://docs.near.org/tools/fastauth-sdk",
      },
      {
        title: "NEAR Protocol",
        url: "https://docs.near.org/concepts/web3/near",
      },
    ],
  },
  {
    title: "Resources",
    links: [
      {
        title: "Documentation",
        url: "https://docs.near.org/",
      },
      {
        title: "Sandbox",
        url: "/sandbox",
      },
      {
        title: "Tutorials",
        url: "https://docs.near.org/bos/tutorial/quickstart",
      },
      {
        title: "GitHub",
        url: "https://github.com/near",
      },
    ],
  },
  {
    title: "Tools",
    links: [
      {
        title: "Overview",
        url: "https://docs.near.org/tools/welcome",
      },
      {
        title: "VS Code Extension",
        url: "https://docs.near.org/bos/dev/vscode",
      },
      {
        title: "BOS Loader",
        url: "https://docs.near.org/bos/dev/bos-loader",
      },
      {
        title: "APIs",
        url: "https://docs.near.org/bos/api/home",
      },
      {
        title: "SDKs",
        url: "https://docs.near.org/sdk/welcome",
      },
      {
        title: "Command Line Tools",
        url: "https://github.com/bos-cli-rs/bos-cli-rs",
      },
    ],
  },
  {
    title: "Ecosystem",
    links: [
      {
        title: "Overview",
        url: "/ecosystem",
      },
      {
        title: "News",
        url: "/nearweekapp.near/widget/nearweek-news",
      },
      {
        title: "Events",
        url: "/events",
      },
      {
        title: "People",
        url: "/people",
      },
      {
        title: "Founders",
        url: "/horizon",
      },
    ],
  },
  {
    title: "About",
    links: [
      {
        title: "Learn",
        url: "/learn",
      },
      {
        title: "Blog",
        url: "/blog",
      },
      {
        title: "Careers",
        url: "https://careers.near.org/jobs",
      },
      {
        title: "Contact us",
        url: "https://pages.near.org/about/contact-us/",
      },
    ],
  },
  {
    title: "Connect",
    links: [
      {
        title: "Discord",
        url: "http://near.chat/",
      },
      {
        title: "Discourse",
        url: "https://gov.near.org/",
      },
      {
        title: "GitHub",
        url: "https://github.com/near",
      },
      {
        title: "Reddit",
        url: "https://www.reddit.com/r/nearprotocol/",
      },
      {
        title: "Telegram",
        url: "https://t.me/cryptonear",
      },
      {
        title: "WeChat",
        url: "https://pages.near.org/wechat",
      },
      {
        title: "X",
        url: "https://twitter.com/nearprotocol",
      },
      {
        title: "YouTube",
        url: "https://www.youtube.com/channel/UCuKdIYVN8iE3fv8alyk1aMw",
      },
    ],
  },
];

return (
  <Wrapper>
    <Container>
      <LinkGrid>
        {sections.map((section) => (
          <div key={section.title}>
            <Text size="16px" weight="500">
              {section.title}
            </Text>

            <ul>
              {section.links.map((link) => (
                <li key={link.title}>
                  <a
                    href={link.url}
                    target={
                      link.url.indexOf("http") === 0 ? "_blank" : undefined
                    }
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </LinkGrid>

      <Bottom>
        <Logo>
          <svg viewBox="0 0 128 32" fill="none">
            <path
              d="M52.6979 4.94885C50.35 4.94885 48.6434 5.50114 47.1923 6.77897L44.6324 8.98811C44.4204 9.15596 43.991 9.28591 43.6921 9.03142C43.3932 8.77694 43.3497 8.43582 43.6051 8.09471L44.9693 6.05342C45.1813 5.75562 45.0128 5.37119 44.6269 5.37119H41.3442C40.9583 5.37119 40.6594 5.66899 40.6594 6.05342V25.9465C40.6594 26.3309 40.9583 26.6287 41.3442 26.6287H44.7574C45.1433 26.6287 45.4422 26.3309 45.4422 25.9465V14.7275C45.4422 9.58371 49.7522 8.77694 51.3718 8.77694C54.8285 8.77694 56.0622 11.2406 56.0622 13.114V25.9519C56.0622 26.3363 56.3611 26.6341 56.747 26.6341H60.1602C60.5461 26.6341 60.845 26.3363 60.845 25.9519V12.6917C60.845 7.93227 57.7308 4.95427 52.6979 4.95427V4.94885Z"
              fill="black"
            />
            <path
              d="M74.7533 4.86223C68.1388 4.86223 63.9158 8.90148 63.9158 14.381V17.3969C63.9158 23.1797 68.1388 27.1323 74.7533 27.1323C80.5959 27.1323 84.6939 24.1164 85.1178 20.0338C85.1613 19.606 84.8624 19.3137 84.433 19.3137H81.1068C80.8079 19.3137 80.5524 19.4815 80.4655 19.7793C80.0361 21.1384 78.036 23.1797 74.7478 23.1797C71.4596 23.1797 68.3889 20.7973 68.4323 17.3969L68.4758 13.6121C68.5193 10.7641 71.5031 8.80943 74.7478 8.80943C77.6936 8.80943 80.547 10.4663 80.8459 13.1844C80.8677 13.4984 80.6557 13.78 80.3405 13.845L70.7748 15.6967C70.3889 15.7834 70.09 16.1191 70.09 16.5468V16.5901C70.09 16.9746 70.4759 17.3103 71.0303 17.3103H84.7646C85.1396 17.3103 85.4494 17.0071 85.4494 16.628V13.9533C85.4494 8.89607 81.0579 4.85681 74.7424 4.85681L74.7533 4.86223Z"
              fill="black"
            />
            <path
              d="M98.5533 4.8623C93.2215 4.8623 88.6126 7.96484 88.6126 12.0474C88.6126 12.3885 88.9115 12.643 89.2974 12.643H92.7541C93.0965 12.643 93.3519 12.3885 93.3954 12.0474C93.7378 10.1794 95.9988 8.81493 98.4283 8.81493C101.331 8.81493 103.293 10.6017 103.293 13.661V17.3591C103.293 21.1439 100.477 23.0552 96.9771 23.0552C94.2487 23.0552 92.6671 22.0373 92.6671 20.375C92.6671 18.9293 93.4335 17.6948 96.5912 16.9747L101.157 15.7401C101.624 15.6102 101.798 15.2312 101.711 14.8034C101.668 14.4623 101.287 14.2945 100.945 14.2945H96.2108C92.1997 14.2945 88.1506 16.8447 88.1506 20.5862V21.1818C88.1506 25.0044 91.7758 27.0024 95.9173 27.0024C98.5641 27.0024 100.825 25.9845 102.233 24.7933L104.325 23.0065C104.668 22.7087 105.01 22.7087 105.309 23.0065C105.564 23.261 105.477 23.6454 105.266 23.9432L103.988 25.9412C103.776 26.239 103.945 26.6234 104.331 26.6234H107.401C107.787 26.6234 108.086 26.3256 108.086 25.9412V13.0653C108.086 8.13269 104.548 4.8623 98.575 4.8623H98.5533Z"
              fill="black"
            />
            <path
              d="M126.495 5.37118H121.717C120.054 5.37118 118.435 6.38912 117.282 7.36915L115.407 8.98269C115.195 9.15054 114.809 9.28049 114.554 9.06932C114.255 8.85815 114.125 8.4304 114.385 8.08929L115.75 6.048C115.962 5.7502 115.793 5.36577 115.407 5.36577H112.206C111.82 5.36577 111.521 5.66357 111.521 6.048V25.9411C111.521 26.3255 111.82 26.6233 112.206 26.6233H115.706C116.092 26.6233 116.391 26.3255 116.391 25.9411V15.74C116.391 11.3651 118.185 9.40502 122.065 9.40502H126.5C126.886 9.40502 127.185 9.10722 127.185 8.72279V6.04259C127.185 5.65815 126.886 5.36035 126.5 5.36035L126.495 5.37118Z"
              fill="black"
            />
            <path
              d="M28.6969 0C27.5066 0 26.4033 0.617259 25.7783 1.62437L19.0661 11.5547C18.8487 11.8795 18.9356 12.3235 19.2671 12.5401C19.5335 12.7188 19.8867 12.6971 20.1259 12.486L26.7349 6.77361C26.8436 6.67614 27.0121 6.68697 27.1153 6.79526C27.1588 6.84399 27.186 6.90897 27.186 6.97394V24.8528C27.186 24.999 27.0664 25.1181 26.9197 25.1181C26.8381 25.1181 26.7675 25.0856 26.7131 25.0206L6.73399 1.20745C6.08179 0.443993 5.12522 0 4.11975 0H3.42406C1.53268 0 0 1.5269 0 3.41117V28.5943C0 30.4785 1.53268 32.0054 3.42406 32.0054C4.61433 32.0054 5.71764 31.3882 6.34267 30.3811L13.0549 20.4508C13.2723 20.1259 13.1854 19.6819 12.8593 19.4653C12.5929 19.2866 12.2397 19.3083 12.0005 19.5195L5.39154 25.2318C5.28284 25.3293 5.11435 25.3184 5.01109 25.2102C4.96761 25.1614 4.94043 25.0965 4.94043 25.0315V7.13638C4.94043 6.99019 5.06 6.87107 5.20675 6.87107C5.28828 6.87107 5.35893 6.90355 5.41328 6.96853L25.387 30.798C26.0392 31.5614 26.9903 32.0054 28.0012 32.0054H28.6969C30.5883 32.0054 32.121 30.4839 32.121 28.5997V3.41117C32.121 1.5269 30.5883 0 28.6969 0Z"
              fill="black"
            />
          </svg>
        </Logo>

        <Text size="12px">© {new Date().getFullYear()} Near.org</Text>
      </Bottom>
    </Container>
  </Wrapper>
);

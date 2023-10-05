// noinspection JSAnnotator

const Content = styled.div`
  .post {
  padding-left: 0;
  padding-right: 0;
  }
`;
const Tabs = styled.div`
  display: flex;
  height: 48px;
  border-bottom: 1px solid #eceef0;
  margin-bottom: 72px;
  overflow: auto;
  scroll-behavior: smooth;

  @media (max-width: 1024px) {
  background: #f8f9fa;
  border-top: 1px solid #eceef0;
  margin: 0 -12px 48px;

  > * {
    flex: 1;
  }
  }
`;

const TabsButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-weight: 600;
  font-size: 12px;
  padding: 0 12px;
  position: relative;
  color: ${(p) => (p.selected ? "#11181C" : "#687076")};
  background: none;
  border: none;
  outline: none;
  text-align: center;
  text-decoration: none !important;

  &:hover {
  color: #11181c;
  }

  &::after {
  content: "";
  display: ${(p) => (p.selected ? "block" : "none")};
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #59e692;
  }
`;

State.init({
    selectedTab: props.tab || "reported",
});
if (props.tab && props.tab !== state.selectedTab) {
    State.update({
        selectedTab: props.tab,
    });
}

const baseUrl = `#/${REPL_ACCOUNT}/widget/Moderation.Moderator?`;
const moderatorAccount = props?.moderatorAccount || "${REPL_MODERATOR}";
const moderationStream = props.moderationStream || moderatorAccount;

return(
    <div className="d-flex flex-column gap-5">
        <span>Admin: {moderatorAccount}</span>
        <Content>
            <Tabs>
                <TabsButton
                    href={`${baseUrl}&tab=reported`}
                    selected={state.selectedTab === "reported"}
                >
                    Reported and needs moderation
                </TabsButton>

                <TabsButton
                    href={`${baseUrl}&tab=moderated_accounts`}
                    selected={state.selectedTab === "moderated_accounts"}
                >
                    Moderated Accounts
                </TabsButton>

                <TabsButton
                    href={`${baseUrl}&tab=moderated_posts`}
                    selected={state.selectedTab === "moderated_posts"}
                >
                    Moderated Posts
                </TabsButton>

                <TabsButton
                    href={`${baseUrl}&tab=moderated_comments`}
                    selected={state.selectedTab === "moderated_comments"}
                >
                    Moderated Comments
                </TabsButton>
            </Tabs>

            {state.selectedTab === "reported" && (
                <Widget
                    src="${REPL_ACCOUNT}/widget/Flagged.Feed"
                />
            )}


            {state.selectedTab === "moderated_accounts" &&
                <Widget
                    src={`${REPL_ACCOUNT}/widget/Moderation.ModerateAccounts`}
                    props={{ moderatorAccount, moderationStream, }}/>
            }

            {state.selectedTab === "moderated_posts" &&
                <Widget
                    src={`${REPL_ACCOUNT}/widget/Moderation.ModeratePosts`}
                    props={{ moderatorAccount, moderationStream, }}/>
            }

            {state.selectedTab === "moderated_comments" && (
                <Widget
                    src={`${REPL_ACCOUNT}/widget/Moderation.ModerateComments`}
                    props={{ moderatorAccount, moderationStream, }}/>
            )}

        </Content>
    </div>
);

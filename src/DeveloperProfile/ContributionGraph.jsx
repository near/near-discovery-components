let { accountId, totalMonths } = props;
accountId = accountId ?? context.accountId;
totalMonths = totalMonths ?? 6;

const GRAPHQL_ENDPOINT = "https://near-queryapi.api.pagoda.co";
const totalDays = totalMonths * 31;
const [totalContributions, setTotalContributions] = useState(0);
const [months, setMonths] = useState([]);
const [isLoading, setIsLoading] = useState(true);

function fetchGraphQL(operationsDoc, operationName, variables) {
  return asyncFetch(`${GRAPHQL_ENDPOINT}/v1/graphql`, {
    method: "POST",
    headers: { "x-hasura-role": "dataplatform_near" },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });
}

const indexerQueries = `
  query CommitGraph($blockTimestampMsBigIntComparison: bigint_comparison_exp, $componentAuthorId: String) {
    dataplatform_near_components_versions(
      where: {
        block_timestamp_ms: $blockTimestampMsBigIntComparison,
        component_author_id: { _eq: $componentAuthorId }
      },
      order_by: { block_timestamp_ms: asc }
      ) {

      block_height
      block_timestamp_ms
      component_author_id
      component_name
      lines_added
      lines_removed
    }
  }
`;

useEffect(() => {
  try {
    const months = [];
    const now = new Date();
    const msPerDay = 1000 * 60 * 60 * 24;
    let date = new Date(now.getTime() - msPerDay * (totalDays - 1)); // Subtract one day to account for current day being included
    date.setHours(0, 0, 0, 0);
    let totalContributionsOverRange = 0;

    fetchGraphQL(indexerQueries, "CommitGraph", {
      blockTimestampMsBigIntComparison: { _gt: date.getTime().toString() },
      componentAuthorId: accountId,
    })
      .then((result) => {
        const versions = result?.body?.data?.dataplatform_near_components_versions || [];

        while (date.getTime() < now.getTime()) {
          let month = months.find((m) => m.date.getMonth() === date.getMonth());

          if (!month) {
            const paddedDays = [];
            const dayOfTheWeek = date.getDay();

            for (let i = 0; i < dayOfTheWeek; i++) {
              paddedDays.push(null);
            }

            month = {
              date,
              days: paddedDays,
            };

            months.push(month);
          }

          let commits = 0;
          let linesAdded = 0;
          let linesRemoved = 0;
          const endOfDay = date.getTime() + msPerDay;

          while (!!versions[0] && versions[0].block_timestamp_ms < endOfDay) {
            const version = versions.shift();
            commits++;
            totalContributionsOverRange++;
            linesAdded += version.lines_added;
            linesRemoved += version.lines_removed;
          }

          month.days.push({
            date,
            commits,
            linesAdded,
            linesRemoved,
          });

          date = new Date(date.getTime() + msPerDay);
        }

        setTotalContributions(totalContributionsOverRange);
        setMonths(months);
        setIsLoading(false);
      })
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    console.error(error);
    setIsLoading(false);
  }
}, [totalDays]);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.06), 0px 0px 0px 1px rgba(0, 0, 0, 0.06);
  background: var(--white);
  overflow: auto;
  scroll-behavior: smooth;
`;

const Text = styled.p`
  font: var(--${(p) => p.size ?? "text-base"});
  font-weight: ${(p) => p.fontWeight} !important;
  color: var(--${(p) => p.color ?? "sand12"});
  margin: 0;
`;

const Label = styled.p`
  font: var(--text-xs);
  font-weight: 500;
  color: var(--sand11);
  margin: 0;
`;

const CalendarSkeleton = styled.div`
  border-radius: 6px;
  height: 130px;
  background: var(--sand4);
  animation: loading 600ms infinite;

  @keyframes loading {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }
`;

const Calendar = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
`;

const WeekdayLabels = styled.div`
  display: flex;
  flex-direction: column;
  height: 101px;
  justify-content: space-evenly;
`;

const Months = styled.div`
  display: flex;
  gap: 20px;
`;

const Month = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Days = styled.div`
  display: grid;
  gap: 4px;
  grid-template-rows: repeat(7, min-content);
  grid-auto-flow: column;
  color: var(--sand6);

  > span {
    // This targets the loading indicator
    display: block !important;
    width: 11px !important;
    height: 11px !important;
    margin: 0 !important;
    padding: 0 !important;
  }
`;

const Day = styled.div`
  width: 11px;
  height: 11px;
  background: var(--sand3);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.075);
  border-radius: 2px;
  cursor: pointer;
  transition: all 200ms;

  &:hover {
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);
  }

  &[data-empty="true"] {
    opacity: 0;
    pointer-events: none;
  }

  &[data-no-hover="true"] {
    pointer-events: none;
  }

  &[data-level="1"] {
    background: var(--violet5);
  }
  &[data-level="2"] {
    background: var(--violet7);
  }
  &[data-level="3"] {
    background: var(--violet8);
  }
  &[data-level="4"] {
    background: var(--violet11);
  }
`;

const TooltipContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TooltipContributionTotals = styled.div`
  display: flex;
  gap: 12px;
`;

const Legend = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  position: sticky;
  left: 0;
`;

const Message = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--violet2);
  border-radius: 6px;

  i {
    color: var(--violet10);
  }

  p {
    color: var(--violet11) !important;
  }
`;

return (
  <Wrapper>
    {isLoading ? (
      <>
        <Text size="text-base" color="sand11">
          Loading contributions...
        </Text>
        <CalendarSkeleton />
      </>
    ) : (
      <>
        <Text size="text-base" color="sand11">
          <Text as="span" size="text-base" color="violet10">
            {totalContributions}
          </Text>{" "}
          contributions in {totalMonths} months
        </Text>
        <Calendar>
          <WeekdayLabels>
            <Label>Mon</Label>
            <Label>Wed</Label>
            <Label>Fri</Label>
          </WeekdayLabels>

          <Months>
            {months.map((month, monthIndex) => (
              <Month key={monthIndex}>
                <Label>{month.date.toLocaleDateString([], { month: "short" })}</Label>

                <Days>
                  {month.days.map((day, dayIndex) => (
                    <Fragment key={dayIndex}>
                      {day ? (
                        <Widget
                          src="${REPL_ACCOUNT}/widget/DIG.Tooltip"
                          props={{
                            content: (
                              <TooltipContent>
                                <Text size="text-xs" color="sand11" fontWeight={500}>
                                  <Text as="span" size="text-xs" color="violet10" fontWeight={500}>
                                    {day.commits}
                                  </Text>{" "}
                                  contribution{day.commits === 1 ? "" : "s"} on{" "}
                                  {day.date.toLocaleDateString([], {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </Text>

                                {(day.linesAdded > 0 || day.linesRemoved > 0) && (
                                  <TooltipContributionTotals>
                                    <Text size="text-xs" color="green11" fontWeight={500}>
                                      +{day.linesAdded}
                                    </Text>
                                    <Text size="text-xs" color="red11" fontWeight={500}>
                                      -{day.linesRemoved}
                                    </Text>
                                  </TooltipContributionTotals>
                                )}
                              </TooltipContent>
                            ),
                            contentProps: {
                              sideOffset: 0,
                            },
                            rootProps: {
                              disableHoverableContent: true,
                            },
                            trigger: <Day data-level={Math.min(day.commits, 4)} />,
                          }}
                        />
                      ) : (
                        <Day data-empty="true" />
                      )}
                    </Fragment>
                  ))}
                </Days>
              </Month>
            ))}
          </Months>
        </Calendar>
      </>
    )}

    <Legend>
      <Label style={{ paddingRight: "4px" }}>Less</Label>
      <Day data-no-hover="true" />
      <Day data-level="1" data-no-hover="true" />
      <Day data-level="2" data-no-hover="true" />
      <Day data-level="3" data-no-hover="true" />
      <Day data-level="4" data-no-hover="true" />
      <Label style={{ paddingLeft: "4px" }}>More</Label>
    </Legend>

    {!isLoading && accountId === context.accountId && totalContributions === 0 && (
      <Message>
        <i className="ph-duotone ph-info" />
        <Text size="text-xs">Publish a component on-chain to populate your graph with contributions.</Text>
      </Message>
    )}
  </Wrapper>
);

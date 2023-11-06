const filterTag = props.categoryFilter || undefined;
const topLimit = props.topLimit || 10;
const title = props.title || undefined;
const width = props.width || "100%";
const height = props.height || "400px";

State.init({
  isLoading: true,
  apps: props.apps || [],
  NoDataAvalaible: false,
  chartConfig: undefined,
});

const createChartConfig = (apps) => {
  const filteredApps = filterTag
    ? apps.filter((app) => app.tags && app.tags.includes(filterTag))
    : apps;
  const topApps = filteredApps
    .filter((app) => app.votes > 0)
    .sort((a, b) => a.votes - b.votes)
    .slice(0, topLimit);
  const appNames = topApps.map((app) =>
    app.name ? app.name : app.widget_name.split("/")[2]
  );
  const appVotes = topApps.map((app) => app.votes);
  if (topApps.length == 0) {
    State.update({
      NoDataAvalaible: true,
    });
  }
  const chartConfig = {
    tooltip: {
      trigger: "axis",
      confine: true,
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "3%",
      right: "3%",
    },
    yAxis: {
      type: "category",
      data: appNames,
      axisLine: { show: true },
      axisTick: { show: false },
      axisLabel: { show: false },
      boundaryGap: true,
    },
    xAxis: {
      type: "value",
      boundaryGap: [0, 1],
      splitLine: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: true },
      max: "dataMax",
      minInterval: 1,
    },
    series: [
      {
        name: "Upvotes",
        type: "bar",
        data: appVotes,
        color: "#59e691",
        legendHoverLink: true,
        label: {
          show: true,
          position: "inside",
          color: "#000",
          formatter: "{b}: {c} {a}",
          overflow: "break",
          fontFamily: "system-ui",
          padding: [0, 0, 0, 50],
          verticalAlign: "middle",
          align: "center",
        },
      },
    ],
  };
  return chartConfig;
};

const loadChartData = () => {
  if (state.isLoading !== true || state.apps.length > 0) return;
  try {
    asyncFetch(
      "https://storage.googleapis.com/databricks-near-query-runner/output/nearcon_apps/apps_qualified_upvoted.json"
    )
      .then((res) => {
        const apps = JSON.parse(res.body).data.map((app_raw) => {
          const app = JSON.parse(app_raw);
          app.votes = apps.num_votes;
          app.recentTag = app.lastest_tag;
          const uniqueTags = Array.from(new Set(app.tags));
          app.tags = uniqueTags;
          return { ...app };
        });
        State.update({
          apps,
          isLoading: false,
        });
      })
      .catch((error) => {
        State.update({
          isLoading: false,
        });
        console.error(error);
      });
  } catch (error) {
    console.error("Error on fetching data:", error);
  }
};

useEffect(() => {
  if (state.apps.length == 0) {
    loadChartData();
    return;
  }
  const chartConfig = createChartConfig(state.apps);
  State.update({
    chartConfig,
    isLoading: false,
  });
}, [state.apps]);

const GraphContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 450px) {
    flex-direction: row;
  }
`;

const Graph = styled.div`
  display: flex;
  margin-bottom: 20px;
  flex-direction: column;
  width: 100%;
  height: 100%;

  @media (min-width: 1024px) {
    width: ${width};
  }
`;

const Title = styled.h3`
  font: var(--text-l);
  font-weight: 700;
  color: var(--sand12);
  margin-bottom: 0;

  @media (min-width: 450px) {
    flex-direction: row;
  }
`;

const Text = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 14px;
  color: #687076;
  padding-top: 10px;
  font-weight: 400;
  flex-shrink: 0;
  white-space: nowrap;
  text-align: center;
  overflow: hidden;
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-tems: center;
  width: ${width};
  height: ${height};
`;

const Loader = () => {
  return (
    <LoaderContainer className="loader">
      <span
        className="spinner-grow spinner-grow-sm me-1"
        role="status"
        aria-hidden="true"
      />
      Loading ...
    </LoaderContainer>
  );
};

return (
  <>
    <Graph style={{ height: height }}>
      {title && <Title>{title}</Title>}
      {state.isLoading && <Loader />}
      {state.NoDataAvalaible && (
        <Text> This category does not have data to show yet. </Text>
      )}
      {!state.isLoading && !state.NoDataAvalaible && (
        <Widget
          src="${REPL_ACCOUNT}/widget/Chart"
          props={{
            definition: state.chartConfig,
            width,
            height,
          }}
        />
      )}
    </Graph>
  </>
);

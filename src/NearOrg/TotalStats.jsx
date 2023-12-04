const stats = {
  totalApps: 0,
  totalComponents: 0,
  totalDevelopers: 0,
};
const componentsData = Social.keys("*/widget/*", "final", {
  return_type: "BlockHeight",
});
if (componentsData) {
  Object.keys(componentsData).forEach((accountId) => {
    stats.totalDevelopers++;
    stats.totalComponents += Object.keys(componentsData[accountId].widget).length;
  });
}
const appComponentsData = Social.keys("*/widget/*/metadata/tags/app", "final");
if (appComponentsData) {
  Object.keys(appComponentsData).forEach((accountId) => {
    stats.totalApps += Object.keys(appComponentsData[accountId].widget).length;
  });
}

return props.children(stats);

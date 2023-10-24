const { blockHeight, blockTimestamp } = props;

if (!blockTimestamp) {
  return (
    <>
      <Widget
        src="${REPL_MOB_2}/widget/TimeAgo${REPL_TIME_AGO_VERSION}"
        props={{ blockHeight }}
      />{" "}
      ago
    </>
  );
}

const blockTimestampMs = Math.floor(blockTimestamp / 1000000); // Convert nanoseconds to milliseconds

const date = new Date(blockTimestampMs);
const dateNow = new Date();

const timeAgo = (diffMs) => {
  const diffSec = diffMs / 1000;
  const diffMin = diffSec / 60;
  const diffHr = diffMin / 60;
  const diffDays = diffHr / 24;

  if (diffSec < 60) return `${Math.round(diffSec)}s ago`;
  if (diffMin < 60) return `${Math.round(diffMin)}m ago`;
  if (diffHr < 24) return `${Math.round(diffHr)}h ago`;

  const diffMonths = Math.round(diffDays / 30);
  if (diffMonths < 12) {
    return diffMonths === 1 ? '1 month' : `${diffMonths} months`;
  }

  const diffYears = Math.round(diffDays / 365);
  return diffYears === 1 ? '1 yr' : `${diffYears} yrs`;
};

return <>{timeAgo(dateNow.getTime() - blockTimestampMs)}</>;

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

// The following logic is copied from: https://near.org/near/widget/ComponentDetailsPage?src=mob.near/widget/TimeAgo&tab=source

const date = new Date(blockTimestampMs);
const dateNow = new Date();
const title = `${date.toLocaleTimeString([], {
  hour: "2-digit",
  minute: "2-digit",
})} ${date.toLocaleDateString([], {
  day: "numeric",
  month: "short",
  year: "numeric",
})}`;

const timeAgo = (diffSec) =>
  diffSec < 60000
    ? `${(diffSec / 1000) | 0}s ago`
    : diffSec < 3600000
    ? `${(diffSec / 60000) | 0}m ago`
    : diffSec < 86400000
    ? `${(diffSec / 3600000) | 0}h ago`
    : date.getFullYear() === dateNow.getFullYear()
    ? date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
      })
    : date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

return <>{timeAgo(dateNow.getTime() - blockTimestampMs)}</>;

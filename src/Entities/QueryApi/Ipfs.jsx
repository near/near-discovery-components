const ipfsUpload = (f) =>
  asyncFetch("https://ipfs.near.social/add", {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: f,
  }).then((res) => res.body.cid);

const ipfsUrl = (cid) => {
  try {
    let c = typeof cid === "object" ? cid.cid : cid;
    if (c.startsWith("{")) {
      c = JSON.parse(c).cid;
    }
    return `https://ipfs.near.social/ipfs/${c}`;
  } catch (ignored) {
    return "";
  }
};

return { ipfsUpload, ipfsUrl };

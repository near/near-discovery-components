const ipfsUpload = (f) =>
  asyncFetch("https://ipfs.near.social/add", {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: f,
  }).then((res) => res.body.cid);

const ipfsUrl = (cid) => {
  const c = typeof cid === "object" ? cid.cid : cid;
  return `https://ipfs.near.social/ipfs/${c}`;
};

return { ipfsUpload, ipfsUrl };

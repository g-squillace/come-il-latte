/* eslint-disable import/no-anonymous-default-export */
export default (req, res) => {
  res.setPreviewData({});
  res.writeHead(307, { Location: "/" });
  res.end();
};

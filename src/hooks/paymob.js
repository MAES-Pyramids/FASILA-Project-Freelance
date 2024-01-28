exports.receivePaymentpost = async (req, res) => {
  console.log("from server");
  console.log(req.body);
  console.log(req.query);
};

exports.receivePaymentget = async (req, res) => {
  console.log("from client");
  console.log(req.body);
  console.log(req.query);
};

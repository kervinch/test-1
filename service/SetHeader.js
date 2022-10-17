
module.exports.setHeader = async (req, res, next) => {
  try {
    res.set({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers':
        'Origin, X-Requested-With, Content-Type, Accept',
    });
    next();
  } catch (error) {
    return error;
  }
};

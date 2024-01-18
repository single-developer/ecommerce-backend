module.exports.validateRequired = (validateFrom, validateTo) => {
  let msg = ``;
  validateFrom.forEach((ele) => {
    if (!validateTo[ele]) {
      msg = `${ele} is required. ${ele} isn't empty.`;
    }
  });
  return msg;
};

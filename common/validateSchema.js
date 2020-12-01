const validate = async (data, schema) => {
  const { error } = await schema.validate(data);
  return error;
};

module.exports = {
  validate,
};

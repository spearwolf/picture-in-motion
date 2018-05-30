
export default (args, withName, callback) => args && args.find(({ name, value }) => {
  const found = name === withName;

  if (found && callback) {
    callback(value);
  }

  return found;
});

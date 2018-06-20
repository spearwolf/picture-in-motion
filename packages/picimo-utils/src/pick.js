
export default names => (obj) => {
  const newObj = {};
  if (obj) {
    names.forEach((key) => {
      const val = obj[key];
      if (val !== undefined) {
        newObj[key] = val;
      }
    });
  }
  return newObj;
};

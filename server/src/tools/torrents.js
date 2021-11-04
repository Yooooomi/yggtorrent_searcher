const config = require('/config/config');

const getDownloadLocation = (category, subcategory, fullpath) => {
  if (process.env.STAGE === 'development') {
    return '/data';
  }
  const dll = config.downloadLocation;

  if (dll instanceof String) {
    return dll;
  } else if (dll instanceof Function) {
    return dll(category, subcategory, fullpath);
  }
}

const getTempLocation = () => {
  if (process.env.STAGE === 'development') {
    return '/data';
  }
  return config.tempLocation;
}

module.exports = {
  getDownloadLocation,
  getTempLocation,
};

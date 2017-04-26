module.exports = {
  generateDOB: function () {
    const max = 820454400000;
    const min =  -725846400000;
    return Math.floor(Math.random() * (max - min)) + min;
  }
};

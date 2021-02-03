const LiveQuiz = artifacts.require("LiveQuiz");

module.exports = function (deployer) {
  deployer.deploy(LiveQuiz);
};

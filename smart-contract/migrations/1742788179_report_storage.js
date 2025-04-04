const Migrations = artifacts.require("ReportStorage");

module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(Migrations);
};
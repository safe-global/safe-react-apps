const deploy = async function (hre) {
  const { deployments, getNamedAccounts } = hre
  const { deployer } = await getNamedAccounts()
  const { deploy } = deployments

  await deploy('BasicTypesTestContract', {
    from: deployer,
    args: [],
    log: true,
  })
}

module.exports = deploy

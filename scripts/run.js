const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const pieContractFactory = await hre.ethers.getContractFactory('PiePortal');
  const pieContract = await pieContractFactory.deploy();
  await pieContract.deployed();

  console.log("Contract deployed to:", pieContract.address);
  console.log("Contract deployed by:", owner.address);

  let pieCount;
  pieCount = await pieContract.getTotalPies();
  
  let pieTxn = await pieContract.pie();
  await pieTxn.wait();

  pieCount = await pieContract.getTotalPies();

  pieTxn = await pieContract.connect(randomPerson).pie();
  await pieTxn.wait();

  waveCount = await pieContract.getTotalPies();
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
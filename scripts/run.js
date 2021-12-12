const main = async () => {
  const pieContractFactory = await hre.ethers.getContractFactory('PiePortal');
  const pieContract = await pieContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.1'),
  });
  await pieContract.deployed();
  console.log("Contract deployed to:", pieContract.address);

  /*
   * Get Contract balance
   */
  let contractBalance = await hre.ethers.provider.getBalance(
    pieContract.address
  );
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );

  let pieCount;
  pieCount = await pieContract.getTotalPies();
  console.log(pieCount.toNumber());

  /**
   * Let's throw some pies!
   */
  let pieTxn = await pieContract.pie('This is wave #1');
  await pieTxn.wait(); // Wait for the transaction to be mined

  let pieTxn2 = await pieContract.pie('This is wave #2');
  await pieTxn2.wait(); // Wait for the transaction to be mined

  /*
   * Get Contract balance to see what happened!
   */
  contractBalance = await hre.ethers.provider.getBalance(pieContract.address);
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );

  const [_, randomPerson] = await hre.ethers.getSigners();
  pieTxn = await pieContract.connect(randomPerson).pie('Another message!');
  await pieTxn.wait(); // Wait for the transaction to be mined

  let allPies = await pieContract.getAllPies();
  console.log(allPies);

  pieCount = await pieContract.getTotalPies();
  console.log(pieCount.toNumber());

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
export const generateYearnSubscriptions = (account) => ({
  action: "subscribe",
  topic: "contractState",
  data: [
    { method: "name", address: "0x0FCDAeDFb8A7DfDa2e9838564c5A1665d856AFDF" },
    {
      method: "balance",
      address: "0x0FCDAeDFb8A7DfDa2e9838564c5A1665d856AFDF",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x0FCDAeDFb8A7DfDa2e9838564c5A1665d856AFDF",
    },
    {
      method: "getPricePerFullShare",
      address: "0x0FCDAeDFb8A7DfDa2e9838564c5A1665d856AFDF",
    },
    { method: "name", address: "0x5dbcF33D8c2E976c6b560249878e6F1491Bca25c" },
    {
      method: "balance",
      address: "0x5dbcF33D8c2E976c6b560249878e6F1491Bca25c",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x5dbcF33D8c2E976c6b560249878e6F1491Bca25c",
    },
    {
      method: "getPricePerFullShare",
      address: "0x5dbcF33D8c2E976c6b560249878e6F1491Bca25c",
    },
    { method: "name", address: "0xcC7E70A958917cCe67B4B87a8C30E6297451aE98" },
    {
      method: "balance",
      address: "0xcC7E70A958917cCe67B4B87a8C30E6297451aE98",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xcC7E70A958917cCe67B4B87a8C30E6297451aE98",
    },
    {
      method: "getPricePerFullShare",
      address: "0xcC7E70A958917cCe67B4B87a8C30E6297451aE98",
    },
    { method: "name", address: "0x597aD1e0c13Bfe8025993D9e79C69E1c0233522e" },
    {
      method: "balance",
      address: "0x597aD1e0c13Bfe8025993D9e79C69E1c0233522e",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x597aD1e0c13Bfe8025993D9e79C69E1c0233522e",
    },
    {
      method: "getPricePerFullShare",
      address: "0x597aD1e0c13Bfe8025993D9e79C69E1c0233522e",
    },
    { method: "name", address: "0xe1237aA7f535b0CC33Fd973D66cBf830354D16c7" },
    {
      method: "balance",
      address: "0xe1237aA7f535b0CC33Fd973D66cBf830354D16c7",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xe1237aA7f535b0CC33Fd973D66cBf830354D16c7",
    },
    {
      method: "getPricePerFullShare",
      address: "0xe1237aA7f535b0CC33Fd973D66cBf830354D16c7",
    },
    { method: "name", address: "0x629c759D1E83eFbF63d84eb3868B564d9521C129" },
    {
      method: "balance",
      address: "0x629c759D1E83eFbF63d84eb3868B564d9521C129",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x629c759D1E83eFbF63d84eb3868B564d9521C129",
    },
    {
      method: "getPricePerFullShare",
      address: "0x629c759D1E83eFbF63d84eb3868B564d9521C129",
    },
    { method: "name", address: "0xec0d8D3ED5477106c6D4ea27D90a60e594693C90" },
    {
      method: "balance",
      address: "0xec0d8D3ED5477106c6D4ea27D90a60e594693C90",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xec0d8D3ED5477106c6D4ea27D90a60e594693C90",
    },
    {
      method: "getPricePerFullShare",
      address: "0xec0d8D3ED5477106c6D4ea27D90a60e594693C90",
    },
    { method: "name", address: "0x9cA85572E6A3EbF24dEDd195623F188735A5179f" },
    {
      method: "balance",
      address: "0x9cA85572E6A3EbF24dEDd195623F188735A5179f",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x9cA85572E6A3EbF24dEDd195623F188735A5179f",
    },
    {
      method: "getPricePerFullShare",
      address: "0x9cA85572E6A3EbF24dEDd195623F188735A5179f",
    },
    { method: "name", address: "0x7Ff566E1d69DEfF32a7b244aE7276b9f90e9D0f6" },
    {
      method: "balance",
      address: "0x7Ff566E1d69DEfF32a7b244aE7276b9f90e9D0f6",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x7Ff566E1d69DEfF32a7b244aE7276b9f90e9D0f6",
    },
    {
      method: "getPricePerFullShare",
      address: "0x7Ff566E1d69DEfF32a7b244aE7276b9f90e9D0f6",
    },
    { method: "name", address: "0x2f08119C6f07c006695E079AAFc638b8789FAf18" },
    {
      method: "balance",
      address: "0x2f08119C6f07c006695E079AAFc638b8789FAf18",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x2f08119C6f07c006695E079AAFc638b8789FAf18",
    },
    {
      method: "getPricePerFullShare",
      address: "0x2f08119C6f07c006695E079AAFc638b8789FAf18",
    },
    { method: "name", address: "0x37d19d1c4E1fa9DC47bD1eA12f742a0887eDa74a" },
    {
      method: "balance",
      address: "0x37d19d1c4E1fa9DC47bD1eA12f742a0887eDa74a",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x37d19d1c4E1fa9DC47bD1eA12f742a0887eDa74a",
    },
    {
      method: "getPricePerFullShare",
      address: "0x37d19d1c4E1fa9DC47bD1eA12f742a0887eDa74a",
    },
    { method: "name", address: "0x881b06da56BB5675c54E4Ed311c21E54C5025298" },
    {
      method: "balance",
      address: "0x881b06da56BB5675c54E4Ed311c21E54C5025298",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x881b06da56BB5675c54E4Ed311c21E54C5025298",
    },
    {
      method: "getPricePerFullShare",
      address: "0x881b06da56BB5675c54E4Ed311c21E54C5025298",
    },
    { method: "name", address: "0xACd43E627e64355f1861cEC6d3a6688B31a6F952" },
    {
      method: "balance",
      address: "0xACd43E627e64355f1861cEC6d3a6688B31a6F952",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xACd43E627e64355f1861cEC6d3a6688B31a6F952",
    },
    {
      method: "getPricePerFullShare",
      address: "0xACd43E627e64355f1861cEC6d3a6688B31a6F952",
    },
    { method: "name", address: "0x2994529C0652D127b7842094103715ec5299bBed" },
    {
      method: "balance",
      address: "0x2994529C0652D127b7842094103715ec5299bBed",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x2994529C0652D127b7842094103715ec5299bBed",
    },
    {
      method: "getPricePerFullShare",
      address: "0x2994529C0652D127b7842094103715ec5299bBed",
    },
    { method: "name", address: "0x29E240CFD7946BA20895a7a02eDb25C210f9f324" },
    {
      method: "balance",
      address: "0x29E240CFD7946BA20895a7a02eDb25C210f9f324",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x29E240CFD7946BA20895a7a02eDb25C210f9f324",
    },
    {
      method: "getPricePerFullShare",
      address: "0x29E240CFD7946BA20895a7a02eDb25C210f9f324",
    },
    { method: "name", address: "0xBA2E7Fed597fd0E3e70f5130BcDbbFE06bB94fe1" },
    {
      method: "balance",
      address: "0xBA2E7Fed597fd0E3e70f5130BcDbbFE06bB94fe1",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xBA2E7Fed597fd0E3e70f5130BcDbbFE06bB94fe1",
    },
    {
      method: "getPricePerFullShare",
      address: "0xBA2E7Fed597fd0E3e70f5130BcDbbFE06bB94fe1",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x1AEf73d49Dedc4b1778d0706583995958Dc862e6",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xD2967f45c4f384DEEa880F807Be904762a3DeA07",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x845838DF265Dcd2c412A1Dc9e959c7d08537f8a2",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x075b1bb99792c9E1041bA13afEf80C91a1e70fB3",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x0000000000085d4780B73119b644AE5ecd22b376",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x3B3Ac5386837Dc563660FB6a0937DFAa5924333B",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xA64BD6C70Cb9051F6A9ba1F163Fdc07E0DfB5F84",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xcB16133a37Ef19F90C570B426292BDcca185BF47",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xBFa4D8AA6d8a379aBFe7793399D3DdaCC5bBECBB",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xe2F6b9773BF3A015E2aA70741Bde1498bdB9425b",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x27Eb83254D900AB4F9b15d5652d913963FeC35e3",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xFeD651936Af7e98F7F2A93c03B1E28a2DA7dfaD4",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xca6c9fb742071044247298ea0dbd60b77586e1e8",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x20Eb2A369b71C29FC4aFCddBbc1CAB66CCfcB062",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x6392e8fa0588CB2DCb7aF557FdC9D10FDe48A325",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x460612682cE6ED51C1A9813F6938671D9D135d6D",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xAa880345A3147a1fC6889080401C791813ed08Dc",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x4720515963A9d40ca10B1aDE806C1291E6c9A86d",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x19db27D2E9E4B780CF9A296D575aBbddEe1578DA",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xd18124029b167e03bbaab8d5d6fbb646ae020e1d",
    },
    {
      args: [account, "0x0FCDAeDFb8A7DfDa2e9838564c5A1665d856AFDF"],
      method: "allowance",
      address: "0x1AEf73d49Dedc4b1778d0706583995958Dc862e6",
    },
    {
      args: [account, "0x5dbcF33D8c2E976c6b560249878e6F1491Bca25c"],
      method: "allowance",
      address: "0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8",
    },
    {
      args: [account, "0xcC7E70A958917cCe67B4B87a8C30E6297451aE98"],
      method: "allowance",
      address: "0xD2967f45c4f384DEEa880F807Be904762a3DeA07",
    },
    {
      args: [account, "0x597aD1e0c13Bfe8025993D9e79C69E1c0233522e"],
      method: "allowance",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    {
      args: [account, "0xe1237aA7f535b0CC33Fd973D66cBf830354D16c7"],
      method: "allowance",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    {
      args: [account, "0x629c759D1E83eFbF63d84eb3868B564d9521C129"],
      method: "allowance",
      address: "0x845838DF265Dcd2c412A1Dc9e959c7d08537f8a2",
    },
    {
      args: [account, "0xec0d8D3ED5477106c6D4ea27D90a60e594693C90"],
      method: "allowance",
      address: "0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd",
    },
    {
      args: [account, "0x9cA85572E6A3EbF24dEDd195623F188735A5179f"],
      method: "allowance",
      address: "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490",
    },
    {
      args: [account, "0x7Ff566E1d69DEfF32a7b244aE7276b9f90e9D0f6"],
      method: "allowance",
      address: "0x075b1bb99792c9E1041bA13afEf80C91a1e70fB3",
    },
    {
      args: [account, "0x2f08119C6f07c006695E079AAFc638b8789FAf18"],
      method: "allowance",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    },
    {
      args: [account, "0x37d19d1c4E1fa9DC47bD1eA12f742a0887eDa74a"],
      method: "allowance",
      address: "0x0000000000085d4780B73119b644AE5ecd22b376",
    },
    {
      args: [account, "0x881b06da56BB5675c54E4Ed311c21E54C5025298"],
      method: "allowance",
      address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    },
    {
      args: [account, "0xACd43E627e64355f1861cEC6d3a6688B31a6F952"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x2994529C0652D127b7842094103715ec5299bBed"],
      method: "allowance",
      address: "0x3B3Ac5386837Dc563660FB6a0937DFAa5924333B",
    },
    {
      args: [account, "0x29E240CFD7946BA20895a7a02eDb25C210f9f324"],
      method: "allowance",
      address: "0xA64BD6C70Cb9051F6A9ba1F163Fdc07E0DfB5F84",
    },
    {
      args: [account, "0xBA2E7Fed597fd0E3e70f5130BcDbbFE06bB94fe1"],
      method: "allowance",
      address: "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e",
    },
  ],
});

export const generateCoverSubscriptions = (account) => ({
  action: "subscribe",
  topic: "contractState",
  data: [
    {
      method: "decimals",
      address: "0x2B8a2F0Bad1Ba4D72033B8475fB0CCC4921cb6Dc",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x2B8a2F0Bad1Ba4D72033B8475fB0CCC4921cb6Dc",
    },
    {
      args: [account, "0xDfe5Ead7bD050eB74009e7717000EeADCF0f18db"],
      method: "allowance",
      address: "0x2B8a2F0Bad1Ba4D72033B8475fB0CCC4921cb6Dc",
    },
    {
      method: "decimals",
      address: "0xD3866617F3DdC2953A969f831830b60F1603e14b",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xD3866617F3DdC2953A969f831830b60F1603e14b",
    },
    {
      args: [account, "0xb9efeE79155b4BD6d06dD1A4c8bABDE306960bab"],
      method: "allowance",
      address: "0xD3866617F3DdC2953A969f831830b60F1603e14b",
    },
    {
      method: "decimals",
      address: "0x47788BD0b95Dd8e1A063843af731286c3904ec71",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x47788BD0b95Dd8e1A063843af731286c3904ec71",
    },
    {
      args: [account, "0x72A250EE19C0f8cc5772F9A33E1E330cDE39e023"],
      method: "allowance",
      address: "0x47788BD0b95Dd8e1A063843af731286c3904ec71",
    },
    {
      method: "decimals",
      address: "0x27d9C33D61b8a04c6c76270440A5B7CfeE06409E",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x27d9C33D61b8a04c6c76270440A5B7CfeE06409E",
    },
    {
      args: [account, "0x3D910518D721a385FA8FC0aD95ad3dE4255BA956"],
      method: "allowance",
      address: "0x27d9C33D61b8a04c6c76270440A5B7CfeE06409E",
    },
    {
      method: "decimals",
      address: "0x95F2b40fD723Da8E2937776920EAB91aBF87aa54",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x95F2b40fD723Da8E2937776920EAB91aBF87aa54",
    },
    {
      args: [account, "0xAa6d172d0358B1612f1d99bB0d02C54949D2bcbC"],
      method: "allowance",
      address: "0x95F2b40fD723Da8E2937776920EAB91aBF87aa54",
    },
    {
      method: "decimals",
      address: "0x90cf010DaEA8f8E9F1e2300e4AFCADa0E2CC2E3F",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x90cf010DaEA8f8E9F1e2300e4AFCADa0E2CC2E3F",
    },
    {
      args: [account, "0x5166c51aa22896B0Ae1B1e2737421d603A779DD6"],
      method: "allowance",
      address: "0x90cf010DaEA8f8E9F1e2300e4AFCADa0E2CC2E3F",
    },
    {
      method: "decimals",
      address: "0x9a3E9E7055a4552ae97C541242924D1E0c5588c9",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x9a3E9E7055a4552ae97C541242924D1E0c5588c9",
    },
    {
      args: [account, "0x533F1164FaCaF30bBe8cC5900fB4F505df3412F7"],
      method: "allowance",
      address: "0x9a3E9E7055a4552ae97C541242924D1E0c5588c9",
    },
    {
      method: "decimals",
      address: "0x7db8E29B9A107351A2255f5065A7405b49d95cAb",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x7db8E29B9A107351A2255f5065A7405b49d95cAb",
    },
    {
      args: [account, "0x47C4a126bc45739C9087aF3968c8e0d2354c5CF5"],
      method: "allowance",
      address: "0x7db8E29B9A107351A2255f5065A7405b49d95cAb",
    },
    {
      method: "decimals",
      address: "0x4a6507c71393D9b55E654e6515494e26a2C982D3",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x4a6507c71393D9b55E654e6515494e26a2C982D3",
    },
    {
      args: [account, "0x05a56e62298E0A5f1F164aAFc1c1F89Ca29F06D7"],
      method: "allowance",
      address: "0x4a6507c71393D9b55E654e6515494e26a2C982D3",
    },
    {
      method: "decimals",
      address: "0xD82ac8d0fd8a5995C5fFd2B366999aB3D360A769",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xD82ac8d0fd8a5995C5fFd2B366999aB3D360A769",
    },
    {
      args: [account, "0x31c2507dfDBb7904201F28A7e18a70f2Cb8CD03E"],
      method: "allowance",
      address: "0xD82ac8d0fd8a5995C5fFd2B366999aB3D360A769",
    },
    {
      method: "decimals",
      address: "0x41764099426529966df42C4010a3863cC87aeb07",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x41764099426529966df42C4010a3863cC87aeb07",
    },
    {
      args: [account, "0x59C0190823276c5aB9D8D41B291EFd1defCE168A"],
      method: "allowance",
      address: "0x41764099426529966df42C4010a3863cC87aeb07",
    },
    {
      method: "decimals",
      address: "0x516FfF6Fbda945742ddD8a1109A100c27208a1a3",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x516FfF6Fbda945742ddD8a1109A100c27208a1a3",
    },
    {
      args: [account, "0xbad3ca7e741F785a05D7B3394db79FcC4b6d85AF"],
      method: "allowance",
      address: "0x516FfF6Fbda945742ddD8a1109A100c27208a1a3",
    },
    {
      method: "decimals",
      address: "0xdE2dD10DCfc298827E794f64fc3AE4FBcB3e19f3",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xdE2dD10DCfc298827E794f64fc3AE4FBcB3e19f3",
    },
    {
      args: [account, "0x68f281072429Dc9fe5929637015f4942B969CD41"],
      method: "allowance",
      address: "0xdE2dD10DCfc298827E794f64fc3AE4FBcB3e19f3",
    },
    {
      method: "decimals",
      address: "0xa506d9D448CA3f69410e92A4312aAde0ee7004B0",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xa506d9D448CA3f69410e92A4312aAde0ee7004B0",
    },
    {
      args: [account, "0x6Cd4EAaE3b61A04002e5543382f2b4B1a364871D"],
      method: "allowance",
      address: "0xa506d9D448CA3f69410e92A4312aAde0ee7004B0",
    },
    {
      method: "decimals",
      address: "0x9DA15283627f10b663beADB1c3e39AAEE8E0ac35",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x9DA15283627f10b663beADB1c3e39AAEE8E0ac35",
    },
    {
      args: [account, "0x94bCc44dB60fcA1c6442Fa6b0684D54c0a1ADa4F"],
      method: "allowance",
      address: "0x9DA15283627f10b663beADB1c3e39AAEE8E0ac35",
    },
    {
      method: "decimals",
      address: "0xeaf081e091f29c6724fb5302366BD44Dc66B1D05",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xeaf081e091f29c6724fb5302366BD44Dc66B1D05",
    },
    {
      args: [account, "0xB58f19e17ef9d8cDd1d870164a026f4135bd0CbF"],
      method: "allowance",
      address: "0xeaf081e091f29c6724fb5302366BD44Dc66B1D05",
    },
    {
      method: "decimals",
      address: "0xf6cD24Ae1D25be15ceAd23494BdA6c6bC1a21F88",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xf6cD24Ae1D25be15ceAd23494BdA6c6bC1a21F88",
    },
    {
      args: [account, "0x6A1544d5569D6b5E0C576444A4375B585688c4C4"],
      method: "allowance",
      address: "0xf6cD24Ae1D25be15ceAd23494BdA6c6bC1a21F88",
    },
    {
      method: "decimals",
      address: "0x07AB6390bC4f105Dd2Ac24A7Cb1Dce9b3ec5c6AF",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x07AB6390bC4f105Dd2Ac24A7Cb1Dce9b3ec5c6AF",
    },
    {
      args: [account, "0xA9D06F185f300C57fA54dc71678b225E4ce89407"],
      method: "allowance",
      address: "0x07AB6390bC4f105Dd2Ac24A7Cb1Dce9b3ec5c6AF",
    },
    {
      method: "decimals",
      address: "0xd6Be8d19d0Db7A7Ac6e8bbbA316F21520c7B3546",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xd6Be8d19d0Db7A7Ac6e8bbbA316F21520c7B3546",
    },
    {
      args: [account, "0x4b2a6951Cf2C9B1F391C219A977E4Cd2f8987cba"],
      method: "allowance",
      address: "0xd6Be8d19d0Db7A7Ac6e8bbbA316F21520c7B3546",
    },
    {
      method: "decimals",
      address: "0xd85ca69e58e9367D72B04D5902b6fdbe39cA4cF1",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xd85ca69e58e9367D72B04D5902b6fdbe39cA4cF1",
    },
    {
      args: [account, "0x0077732357Ac0F29E26ea629B79Ab3B266dDB796"],
      method: "allowance",
      address: "0xd85ca69e58e9367D72B04D5902b6fdbe39cA4cF1",
    },
    {
      method: "decimals",
      address: "0xdCae72A16138876F88c676c7a1c0b2e6B10852aB",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xdCae72A16138876F88c676c7a1c0b2e6B10852aB",
    },
    {
      args: [account, "0x6CCeb04f626Fb4CFCF62669805B535E36E1c70cE"],
      method: "allowance",
      address: "0xdCae72A16138876F88c676c7a1c0b2e6B10852aB",
    },
    {
      method: "decimals",
      address: "0xA7daC6774E5e40F56a0BF06AF6cf9b1F3d037bcc",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xA7daC6774E5e40F56a0BF06AF6cf9b1F3d037bcc",
    },
    {
      args: [account, "0xeB2b9959c7943EB3c0bDb69ede25247bAB4D1C6C"],
      method: "allowance",
      address: "0xA7daC6774E5e40F56a0BF06AF6cf9b1F3d037bcc",
    },
    {
      method: "decimals",
      address: "0x52e6caccB7afFC30a3ceEE544428692Fa2120e7b",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x52e6caccB7afFC30a3ceEE544428692Fa2120e7b",
    },
    {
      args: [account, "0x0f24b5730e0AEDF61D22AabBf0079D517203D48E"],
      method: "allowance",
      address: "0x52e6caccB7afFC30a3ceEE544428692Fa2120e7b",
    },
    {
      method: "decimals",
      address: "0x93156729bEF419C3Af84afE6B42d718de7cC88cc",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x93156729bEF419C3Af84afE6B42d718de7cC88cc",
    },
    {
      args: [account, "0x57F1835f0bcFB4B3E913C6474B4AD02C33812196"],
      method: "allowance",
      address: "0x93156729bEF419C3Af84afE6B42d718de7cC88cc",
    },
    {
      method: "decimals",
      address: "0xB3F84A33A040Ccf4A95a5dEEaFdb461832874efE",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xB3F84A33A040Ccf4A95a5dEEaFdb461832874efE",
    },
    {
      args: [account, "0x4D2E7d81d4DA0fE8ac831344d54c027F3EeA324C"],
      method: "allowance",
      address: "0xB3F84A33A040Ccf4A95a5dEEaFdb461832874efE",
    },
    {
      method: "decimals",
      address: "0x82245Eb2728cE0b2986c547898b40012B138fbDa",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x82245Eb2728cE0b2986c547898b40012B138fbDa",
    },
    {
      args: [account, "0xeE11fbe8d835328bCF2588e17276B1375d909f29"],
      method: "allowance",
      address: "0x82245Eb2728cE0b2986c547898b40012B138fbDa",
    },
    { method: "name", address: "0x6B175474E89094C44Da98b954EedeAC495271d0F" },
    {
      method: "decimals",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    { method: "name", address: "0x16de59092dAE5CcF4A1E6439D611fd0653f0Bd01" },
    {
      method: "decimals",
      address: "0x16de59092dAE5CcF4A1E6439D611fd0653f0Bd01",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x16de59092dAE5CcF4A1E6439D611fd0653f0Bd01",
    },
    {
      args: [account, "0xDfe5Ead7bD050eB74009e7717000EeADCF0f18db"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0xb9efeE79155b4BD6d06dD1A4c8bABDE306960bab"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x72A250EE19C0f8cc5772F9A33E1E330cDE39e023"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x3D910518D721a385FA8FC0aD95ad3dE4255BA956"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0xAa6d172d0358B1612f1d99bB0d02C54949D2bcbC"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x5166c51aa22896B0Ae1B1e2737421d603A779DD6"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x533F1164FaCaF30bBe8cC5900fB4F505df3412F7"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x47C4a126bc45739C9087aF3968c8e0d2354c5CF5"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x05a56e62298E0A5f1F164aAFc1c1F89Ca29F06D7"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x31c2507dfDBb7904201F28A7e18a70f2Cb8CD03E"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x59C0190823276c5aB9D8D41B291EFd1defCE168A"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0xbad3ca7e741F785a05D7B3394db79FcC4b6d85AF"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x68f281072429Dc9fe5929637015f4942B969CD41"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x6Cd4EAaE3b61A04002e5543382f2b4B1a364871D"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x94bCc44dB60fcA1c6442Fa6b0684D54c0a1ADa4F"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0xB58f19e17ef9d8cDd1d870164a026f4135bd0CbF"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x6A1544d5569D6b5E0C576444A4375B585688c4C4"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0xA9D06F185f300C57fA54dc71678b225E4ce89407"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x4b2a6951Cf2C9B1F391C219A977E4Cd2f8987cba"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x0077732357Ac0F29E26ea629B79Ab3B266dDB796"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x6CCeb04f626Fb4CFCF62669805B535E36E1c70cE"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0xeB2b9959c7943EB3c0bDb69ede25247bAB4D1C6C"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x0f24b5730e0AEDF61D22AabBf0079D517203D48E"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x57F1835f0bcFB4B3E913C6474B4AD02C33812196"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x4D2E7d81d4DA0fE8ac831344d54c027F3EeA324C"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0xeE11fbe8d835328bCF2588e17276B1375d909f29"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      method: "decimals",
      address: "0x2B8a2F0Bad1Ba4D72033B8475fB0CCC4921cb6Dc",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x2B8a2F0Bad1Ba4D72033B8475fB0CCC4921cb6Dc",
    },
    {
      args: [account, "0xDfe5Ead7bD050eB74009e7717000EeADCF0f18db"],
      method: "allowance",
      address: "0x2B8a2F0Bad1Ba4D72033B8475fB0CCC4921cb6Dc",
    },
    {
      method: "decimals",
      address: "0xD3866617F3DdC2953A969f831830b60F1603e14b",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xD3866617F3DdC2953A969f831830b60F1603e14b",
    },
    {
      args: [account, "0xb9efeE79155b4BD6d06dD1A4c8bABDE306960bab"],
      method: "allowance",
      address: "0xD3866617F3DdC2953A969f831830b60F1603e14b",
    },
    {
      method: "decimals",
      address: "0x47788BD0b95Dd8e1A063843af731286c3904ec71",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x47788BD0b95Dd8e1A063843af731286c3904ec71",
    },
    {
      args: [account, "0x72A250EE19C0f8cc5772F9A33E1E330cDE39e023"],
      method: "allowance",
      address: "0x47788BD0b95Dd8e1A063843af731286c3904ec71",
    },
    {
      method: "decimals",
      address: "0x27d9C33D61b8a04c6c76270440A5B7CfeE06409E",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x27d9C33D61b8a04c6c76270440A5B7CfeE06409E",
    },
    {
      args: [account, "0x3D910518D721a385FA8FC0aD95ad3dE4255BA956"],
      method: "allowance",
      address: "0x27d9C33D61b8a04c6c76270440A5B7CfeE06409E",
    },
    {
      method: "decimals",
      address: "0x95F2b40fD723Da8E2937776920EAB91aBF87aa54",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x95F2b40fD723Da8E2937776920EAB91aBF87aa54",
    },
    {
      args: [account, "0xAa6d172d0358B1612f1d99bB0d02C54949D2bcbC"],
      method: "allowance",
      address: "0x95F2b40fD723Da8E2937776920EAB91aBF87aa54",
    },
    {
      method: "decimals",
      address: "0x90cf010DaEA8f8E9F1e2300e4AFCADa0E2CC2E3F",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x90cf010DaEA8f8E9F1e2300e4AFCADa0E2CC2E3F",
    },
    {
      args: [account, "0x5166c51aa22896B0Ae1B1e2737421d603A779DD6"],
      method: "allowance",
      address: "0x90cf010DaEA8f8E9F1e2300e4AFCADa0E2CC2E3F",
    },
    {
      method: "decimals",
      address: "0x9a3E9E7055a4552ae97C541242924D1E0c5588c9",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x9a3E9E7055a4552ae97C541242924D1E0c5588c9",
    },
    {
      args: [account, "0x533F1164FaCaF30bBe8cC5900fB4F505df3412F7"],
      method: "allowance",
      address: "0x9a3E9E7055a4552ae97C541242924D1E0c5588c9",
    },
    {
      method: "decimals",
      address: "0x7db8E29B9A107351A2255f5065A7405b49d95cAb",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x7db8E29B9A107351A2255f5065A7405b49d95cAb",
    },
    {
      args: [account, "0x47C4a126bc45739C9087aF3968c8e0d2354c5CF5"],
      method: "allowance",
      address: "0x7db8E29B9A107351A2255f5065A7405b49d95cAb",
    },
    {
      method: "decimals",
      address: "0x4a6507c71393D9b55E654e6515494e26a2C982D3",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x4a6507c71393D9b55E654e6515494e26a2C982D3",
    },
    {
      args: [account, "0x05a56e62298E0A5f1F164aAFc1c1F89Ca29F06D7"],
      method: "allowance",
      address: "0x4a6507c71393D9b55E654e6515494e26a2C982D3",
    },
    {
      method: "decimals",
      address: "0xD82ac8d0fd8a5995C5fFd2B366999aB3D360A769",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xD82ac8d0fd8a5995C5fFd2B366999aB3D360A769",
    },
    {
      args: [account, "0x31c2507dfDBb7904201F28A7e18a70f2Cb8CD03E"],
      method: "allowance",
      address: "0xD82ac8d0fd8a5995C5fFd2B366999aB3D360A769",
    },
    {
      method: "decimals",
      address: "0x41764099426529966df42C4010a3863cC87aeb07",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x41764099426529966df42C4010a3863cC87aeb07",
    },
    {
      args: [account, "0x59C0190823276c5aB9D8D41B291EFd1defCE168A"],
      method: "allowance",
      address: "0x41764099426529966df42C4010a3863cC87aeb07",
    },
    {
      method: "decimals",
      address: "0x516FfF6Fbda945742ddD8a1109A100c27208a1a3",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x516FfF6Fbda945742ddD8a1109A100c27208a1a3",
    },
    {
      args: [account, "0xbad3ca7e741F785a05D7B3394db79FcC4b6d85AF"],
      method: "allowance",
      address: "0x516FfF6Fbda945742ddD8a1109A100c27208a1a3",
    },
    {
      method: "decimals",
      address: "0xdE2dD10DCfc298827E794f64fc3AE4FBcB3e19f3",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xdE2dD10DCfc298827E794f64fc3AE4FBcB3e19f3",
    },
    {
      args: [account, "0x68f281072429Dc9fe5929637015f4942B969CD41"],
      method: "allowance",
      address: "0xdE2dD10DCfc298827E794f64fc3AE4FBcB3e19f3",
    },
    {
      method: "decimals",
      address: "0xa506d9D448CA3f69410e92A4312aAde0ee7004B0",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xa506d9D448CA3f69410e92A4312aAde0ee7004B0",
    },
    {
      args: [account, "0x6Cd4EAaE3b61A04002e5543382f2b4B1a364871D"],
      method: "allowance",
      address: "0xa506d9D448CA3f69410e92A4312aAde0ee7004B0",
    },
    {
      method: "decimals",
      address: "0x9DA15283627f10b663beADB1c3e39AAEE8E0ac35",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x9DA15283627f10b663beADB1c3e39AAEE8E0ac35",
    },
    {
      args: [account, "0x94bCc44dB60fcA1c6442Fa6b0684D54c0a1ADa4F"],
      method: "allowance",
      address: "0x9DA15283627f10b663beADB1c3e39AAEE8E0ac35",
    },
    {
      method: "decimals",
      address: "0xeaf081e091f29c6724fb5302366BD44Dc66B1D05",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xeaf081e091f29c6724fb5302366BD44Dc66B1D05",
    },
    {
      args: [account, "0xB58f19e17ef9d8cDd1d870164a026f4135bd0CbF"],
      method: "allowance",
      address: "0xeaf081e091f29c6724fb5302366BD44Dc66B1D05",
    },
    {
      method: "decimals",
      address: "0xf6cD24Ae1D25be15ceAd23494BdA6c6bC1a21F88",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xf6cD24Ae1D25be15ceAd23494BdA6c6bC1a21F88",
    },
    {
      args: [account, "0x6A1544d5569D6b5E0C576444A4375B585688c4C4"],
      method: "allowance",
      address: "0xf6cD24Ae1D25be15ceAd23494BdA6c6bC1a21F88",
    },
    {
      method: "decimals",
      address: "0x07AB6390bC4f105Dd2Ac24A7Cb1Dce9b3ec5c6AF",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x07AB6390bC4f105Dd2Ac24A7Cb1Dce9b3ec5c6AF",
    },
    {
      args: [account, "0xA9D06F185f300C57fA54dc71678b225E4ce89407"],
      method: "allowance",
      address: "0x07AB6390bC4f105Dd2Ac24A7Cb1Dce9b3ec5c6AF",
    },
    {
      method: "decimals",
      address: "0xd6Be8d19d0Db7A7Ac6e8bbbA316F21520c7B3546",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xd6Be8d19d0Db7A7Ac6e8bbbA316F21520c7B3546",
    },
    {
      args: [account, "0x4b2a6951Cf2C9B1F391C219A977E4Cd2f8987cba"],
      method: "allowance",
      address: "0xd6Be8d19d0Db7A7Ac6e8bbbA316F21520c7B3546",
    },
    {
      method: "decimals",
      address: "0xd85ca69e58e9367D72B04D5902b6fdbe39cA4cF1",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xd85ca69e58e9367D72B04D5902b6fdbe39cA4cF1",
    },
    {
      args: [account, "0x0077732357Ac0F29E26ea629B79Ab3B266dDB796"],
      method: "allowance",
      address: "0xd85ca69e58e9367D72B04D5902b6fdbe39cA4cF1",
    },
    {
      method: "decimals",
      address: "0xdCae72A16138876F88c676c7a1c0b2e6B10852aB",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xdCae72A16138876F88c676c7a1c0b2e6B10852aB",
    },
    {
      args: [account, "0x6CCeb04f626Fb4CFCF62669805B535E36E1c70cE"],
      method: "allowance",
      address: "0xdCae72A16138876F88c676c7a1c0b2e6B10852aB",
    },
    {
      method: "decimals",
      address: "0xA7daC6774E5e40F56a0BF06AF6cf9b1F3d037bcc",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xA7daC6774E5e40F56a0BF06AF6cf9b1F3d037bcc",
    },
    {
      args: [account, "0xeB2b9959c7943EB3c0bDb69ede25247bAB4D1C6C"],
      method: "allowance",
      address: "0xA7daC6774E5e40F56a0BF06AF6cf9b1F3d037bcc",
    },
    {
      method: "decimals",
      address: "0x52e6caccB7afFC30a3ceEE544428692Fa2120e7b",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x52e6caccB7afFC30a3ceEE544428692Fa2120e7b",
    },
    {
      args: [account, "0x0f24b5730e0AEDF61D22AabBf0079D517203D48E"],
      method: "allowance",
      address: "0x52e6caccB7afFC30a3ceEE544428692Fa2120e7b",
    },
    {
      method: "decimals",
      address: "0x93156729bEF419C3Af84afE6B42d718de7cC88cc",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x93156729bEF419C3Af84afE6B42d718de7cC88cc",
    },
    {
      args: [account, "0x57F1835f0bcFB4B3E913C6474B4AD02C33812196"],
      method: "allowance",
      address: "0x93156729bEF419C3Af84afE6B42d718de7cC88cc",
    },
    {
      method: "decimals",
      address: "0xB3F84A33A040Ccf4A95a5dEEaFdb461832874efE",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xB3F84A33A040Ccf4A95a5dEEaFdb461832874efE",
    },
    {
      args: [account, "0x4D2E7d81d4DA0fE8ac831344d54c027F3EeA324C"],
      method: "allowance",
      address: "0xB3F84A33A040Ccf4A95a5dEEaFdb461832874efE",
    },
    {
      method: "decimals",
      address: "0x82245Eb2728cE0b2986c547898b40012B138fbDa",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x82245Eb2728cE0b2986c547898b40012B138fbDa",
    },
    {
      args: [account, "0xeE11fbe8d835328bCF2588e17276B1375d909f29"],
      method: "allowance",
      address: "0x82245Eb2728cE0b2986c547898b40012B138fbDa",
    },
    {
      method: "name",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      method: "decimals",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      method: "name",
      address: "0x16de59092dAE5CcF4A1E6439D611fd0653f0Bd01",
    },
    {
      method: "decimals",
      address: "0x16de59092dAE5CcF4A1E6439D611fd0653f0Bd01",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x16de59092dAE5CcF4A1E6439D611fd0653f0Bd01",
    },
    {
      args: [account, "0xDfe5Ead7bD050eB74009e7717000EeADCF0f18db"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0xb9efeE79155b4BD6d06dD1A4c8bABDE306960bab"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x72A250EE19C0f8cc5772F9A33E1E330cDE39e023"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x3D910518D721a385FA8FC0aD95ad3dE4255BA956"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0xAa6d172d0358B1612f1d99bB0d02C54949D2bcbC"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x5166c51aa22896B0Ae1B1e2737421d603A779DD6"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x533F1164FaCaF30bBe8cC5900fB4F505df3412F7"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x47C4a126bc45739C9087aF3968c8e0d2354c5CF5"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x05a56e62298E0A5f1F164aAFc1c1F89Ca29F06D7"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x31c2507dfDBb7904201F28A7e18a70f2Cb8CD03E"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x59C0190823276c5aB9D8D41B291EFd1defCE168A"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0xbad3ca7e741F785a05D7B3394db79FcC4b6d85AF"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x68f281072429Dc9fe5929637015f4942B969CD41"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x6Cd4EAaE3b61A04002e5543382f2b4B1a364871D"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x94bCc44dB60fcA1c6442Fa6b0684D54c0a1ADa4F"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0xB58f19e17ef9d8cDd1d870164a026f4135bd0CbF"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x6A1544d5569D6b5E0C576444A4375B585688c4C4"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0xA9D06F185f300C57fA54dc71678b225E4ce89407"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x4b2a6951Cf2C9B1F391C219A977E4Cd2f8987cba"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x0077732357Ac0F29E26ea629B79Ab3B266dDB796"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x6CCeb04f626Fb4CFCF62669805B535E36E1c70cE"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0xeB2b9959c7943EB3c0bDb69ede25247bAB4D1C6C"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x0f24b5730e0AEDF61D22AabBf0079D517203D48E"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x57F1835f0bcFB4B3E913C6474B4AD02C33812196"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x4D2E7d81d4DA0fE8ac831344d54c027F3EeA324C"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0xeE11fbe8d835328bCF2588e17276B1375d909f29"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
  ],
});

export const generateCreamSubscriptions = (account) => ({
  action: "subscribe",
  topic: "contractState",
  data: [
    {
      args: [account],
      method: "getAssetsIn",
      address: "0xAB1c342C7bf5Ec5F02ADEA1c2270670bCa144CbB",
    },
    {
      args: ["0x41c84c0e2EE0b740Cf0d31F63f3B6F627DC6b393"],
      method: "markets",
      address: "0xAB1c342C7bf5Ec5F02ADEA1c2270670bCa144CbB",
    },
    {
      args: ["0x8e595470Ed749b85C6F7669de83EAe304C2ec68F"],
      method: "markets",
      address: "0xAB1c342C7bf5Ec5F02ADEA1c2270670bCa144CbB",
    },
    {
      args: ["0x7589C9E17BCFcE1Ccaa1f921196FDa177F0207Fc"],
      method: "markets",
      address: "0xAB1c342C7bf5Ec5F02ADEA1c2270670bCa144CbB",
    },
    {
      method: "name",
      address: "0x41c84c0e2EE0b740Cf0d31F63f3B6F627DC6b393",
    },
    {
      method: "symbol",
      address: "0x41c84c0e2EE0b740Cf0d31F63f3B6F627DC6b393",
    },
    {
      method: "decimals",
      address: "0x41c84c0e2EE0b740Cf0d31F63f3B6F627DC6b393",
    },
    {
      method: "borrowRatePerBlock",
      address: "0x41c84c0e2EE0b740Cf0d31F63f3B6F627DC6b393",
    },
    {
      method: "supplyRatePerBlock",
      address: "0x41c84c0e2EE0b740Cf0d31F63f3B6F627DC6b393",
    },
    {
      method: "exchangeRateStored",
      address: "0x41c84c0e2EE0b740Cf0d31F63f3B6F627DC6b393",
    },
    {
      method: "getCash",
      address: "0x41c84c0e2EE0b740Cf0d31F63f3B6F627DC6b393",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x41c84c0e2EE0b740Cf0d31F63f3B6F627DC6b393",
    },
    {
      args: [account],
      method: "borrowBalanceStored",
      address: "0x41c84c0e2EE0b740Cf0d31F63f3B6F627DC6b393",
    },
    {
      method: "underlying",
      address: "0x41c84c0e2EE0b740Cf0d31F63f3B6F627DC6b393",
    },
    {
      method: "name",
      address: "0x8e595470Ed749b85C6F7669de83EAe304C2ec68F",
    },
    {
      method: "symbol",
      address: "0x8e595470Ed749b85C6F7669de83EAe304C2ec68F",
    },
    {
      method: "decimals",
      address: "0x8e595470Ed749b85C6F7669de83EAe304C2ec68F",
    },
    {
      method: "borrowRatePerBlock",
      address: "0x8e595470Ed749b85C6F7669de83EAe304C2ec68F",
    },
    {
      method: "supplyRatePerBlock",
      address: "0x8e595470Ed749b85C6F7669de83EAe304C2ec68F",
    },
    {
      method: "exchangeRateStored",
      address: "0x8e595470Ed749b85C6F7669de83EAe304C2ec68F",
    },
    {
      method: "getCash",
      address: "0x8e595470Ed749b85C6F7669de83EAe304C2ec68F",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x8e595470Ed749b85C6F7669de83EAe304C2ec68F",
    },
    {
      args: [account],
      method: "borrowBalanceStored",
      address: "0x8e595470Ed749b85C6F7669de83EAe304C2ec68F",
    },
    {
      method: "underlying",
      address: "0x8e595470Ed749b85C6F7669de83EAe304C2ec68F",
    },
    {
      method: "name",
      address: "0x7589C9E17BCFcE1Ccaa1f921196FDa177F0207Fc",
    },
    {
      method: "symbol",
      address: "0x7589C9E17BCFcE1Ccaa1f921196FDa177F0207Fc",
    },
    {
      method: "decimals",
      address: "0x7589C9E17BCFcE1Ccaa1f921196FDa177F0207Fc",
    },
    {
      method: "borrowRatePerBlock",
      address: "0x7589C9E17BCFcE1Ccaa1f921196FDa177F0207Fc",
    },
    {
      method: "supplyRatePerBlock",
      address: "0x7589C9E17BCFcE1Ccaa1f921196FDa177F0207Fc",
    },
    {
      method: "exchangeRateStored",
      address: "0x7589C9E17BCFcE1Ccaa1f921196FDa177F0207Fc",
    },
    {
      method: "getCash",
      address: "0x7589C9E17BCFcE1Ccaa1f921196FDa177F0207Fc",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x7589C9E17BCFcE1Ccaa1f921196FDa177F0207Fc",
    },
    {
      args: [account],
      method: "borrowBalanceStored",
      address: "0x7589C9E17BCFcE1Ccaa1f921196FDa177F0207Fc",
    },
    {
      method: "underlying",
      address: "0x7589C9E17BCFcE1Ccaa1f921196FDa177F0207Fc",
    },
    {
      args: ["0x41c84c0e2EE0b740Cf0d31F63f3B6F627DC6b393"],
      method: "getUnderlyingPrice",
      address: "0xE4C1E5d96360847De7DFF72D2bD1c4B3d4284E97",
    },
    {
      args: ["0x8e595470Ed749b85C6F7669de83EAe304C2ec68F"],
      method: "getUnderlyingPrice",
      address: "0xE4C1E5d96360847De7DFF72D2bD1c4B3d4284E97",
    },
    {
      args: ["0x7589C9E17BCFcE1Ccaa1f921196FDa177F0207Fc"],
      method: "getUnderlyingPrice",
      address: "0xE4C1E5d96360847De7DFF72D2bD1c4B3d4284E97",
    },
    {
      method: "name",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    {
      method: "symbol",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    {
      method: "decimals",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    {
      args: [account, "0x41c84c0e2EE0b740Cf0d31F63f3B6F627DC6b393"],
      method: "allowance",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    {
      method: "name",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      method: "symbol",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      method: "decimals",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      args: [account, "0x8e595470Ed749b85C6F7669de83EAe304C2ec68F"],
      method: "allowance",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      method: "name",
      address: "0x9cA85572E6A3EbF24dEDd195623F188735A5179f",
    },
    {
      method: "symbol",
      address: "0x9cA85572E6A3EbF24dEDd195623F188735A5179f",
    },
    {
      method: "decimals",
      address: "0x9cA85572E6A3EbF24dEDd195623F188735A5179f",
    },
    {
      args: [account],
      method: "balanceOf",
      address: "0x9cA85572E6A3EbF24dEDd195623F188735A5179f",
    },
    {
      args: [account, "0x7589C9E17BCFcE1Ccaa1f921196FDa177F0207Fc"],
      method: "allowance",
      address: "0x9cA85572E6A3EbF24dEDd195623F188735A5179f",
    },
  ],
});

export const generateSushiSubscriptions = (account) => ({
  action: "subscribe",
  topic: "contractState",
  data: [
    {
      address: "0xE4C1E5d96360847De7DFF72D2bD1c4B3d4284E97",
      method: "getUnderlyingPrice",
      args: ["0x7589C9E17BCFcE1Ccaa1f921196FDa177F0207Fc"],
    },
    {
      address: "0x397FF1542f962076d0BFE58eA045FfA2d347ACa0",
      method: "getReserves",
    },
    {
      address: "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc",
      method: "getReserves",
    },
    {
      address: "0xBb2b8038a1640196FbE3e38816F3e67Cba72D940",
      method: "getReserves",
    },
    {
      address: "0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11",
      method: "getReserves",
    },
    {
      address: "0xF52f433B79d21023af94251958BEd3b64a2b7930",
      method: "getReserves",
    },
    {
      address: "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852",
      method: "getReserves",
    },
    {
      address: "0xd4405F0704621DBe9d4dEA60E128E0C3b26bddbD",
      method: "getReserves",
    },
    {
      address: "0xd3d2E2692501A5c9Ca623199D38826e513033a17",
      method: "getReserves",
    },
    {
      address: "0xc5be99A02C6857f9Eac67BbCE58DF5572498F40c",
      method: "getReserves",
    },
    {
      address: "0x8878Df9E1A7c87dcBf6d3999D997f262C05D8C70",
      method: "getReserves",
    },
    {
      address: "0x23d15EDceb5B5B3A23347Fa425846DE80a2E8e5C",
      method: "getReserves",
    },
    {
      address: "0xeC6a6b7dB761A5c9910bA8fcaB98116d384b1B85",
      method: "getReserves",
    },
    {
      address: "0xFD0A40Bc83C5faE4203DEc7e5929B446b07d1C76",
      method: "getReserves",
    },
    {
      address: "0x85609C626b532ca8BEA6c36Be53afdcB15Dd4A48",
      method: "getReserves",
    },
    {
      address: "0xc50Ef7861153C51D383d9a7d48e6C9467fB90c38",
      method: "getReserves",
    },
    {
      address: "0xAC08f19b13548d55294BCEfCf751d81EA65845d5",
      method: "getReserves",
    },
    {
      address: "0xDFC14d2Af169B0D36C4EFF567Ada9b2E0CAE044f",
      method: "getReserves",
    },
    {
      address: "0x88ff79eB2Bc5850F27315415da8685282C7610F9",
      method: "getReserves",
    },
    {
      address: "0x32Ce7e48debdccbFE0CD037Cc89526E4382cb81b",
      method: "getReserves",
    },
  ],
});

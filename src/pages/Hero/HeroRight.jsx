import { useState, useEffect } from "react";
import { RiMoneyEuroCircleLine } from "react-icons/ri";
import { FaEthereum, FaHandHoldingUsd, FaRegCreditCard } from "react-icons/fa";
import Button from "../../components/global/Button";
import osImg from "../../utils/images/osImg.png";
import { ethers } from "ethers";
import { abi as TokenSaleAbi } from "../../contracts/TokenSale.json";
import { abi as TetherUSdtAbi } from "../../contracts/USDTToken.json";
import WalletComponent from "../../components/global/WalletConnect";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers5/react";
// import WertComponent from "../../components/global/Wert";
import WertComponent from "../../components/global/Wert2";
import BankTransferModal from "../../components/global/BankTransfer";

const HeroRight = () => {
  const { chainId, address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  console.log("walet provider ", walletProvider);

  const [activate, setActivate] = useState("ETH");
  const [usdtAmount, setUsdtAmount] = useState("");
  const [SixensetokenAmount, setSixensetokenAmount] = useState("");
  const [ethAmount, setEthAmount] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [ethAmountError, setEthAmountError] = useState("");
  const [USDTAmountError, setUSDTAmountError] = useState("");
  const [ethBalance, setEthBalance] = useState(0);
  const [usdtBalance, setUSDTBalance] = useState(0);
  const [usdtTrxHash, setusdtTrxHash] = useState(0);
  const [EtherTrxHash, setEtherTrxHash] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handler to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Handler to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const contractAddressETH = "0xe14F2e37935A7b500CeF56D2779FFeCa79F0bf65";
  const contractAddressBSC = "";
  const USDTContractEthereum = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const USDTContractBNB = "0x55d398326f99059fF775485246999027B3197955";

  const fetchEthBalance = async () => {
    try {
      if (address) {
        let provider = new ethers.providers.Web3Provider(walletProvider);

        const balance = await provider.getBalance(address);
        const formattedBalance = ethers.utils.formatEther(balance);
        console.log("ETH balance:", formattedBalance);
        setEthBalance(parseFloat(formattedBalance));
      }
    } catch (error) {
      console.error("Error fetching ETH balance:", error);
    }
  };

  // const getChainId = async () => {
  //   const chainId = await window.ethereum // Or window.ethereum if you don't support EIP-6963.
  //     .request({ method: "eth_chainId" });
  //   setactiveChain(chainId);
  //   if (chainId !== "0x1" && chainId !== "0x38") {
  //     await window.ethereum.request({
  //       method: "wallet_switchEthereumChain",
  //       params: [{ chainId: "0x1" }],
  //     });
  //     window.location.reload();
  //   }
  // };

  useEffect(() => {
    fetchEthBalance();
    fetchUSDTBalance();
  }, [address]);

  useEffect(() => { }, []);

  const fetchUSDTBalance = async () => {
    try {
      let provider = new ethers.providers.Web3Provider(walletProvider);

      if (address) {
        let contractAddress =
          chainId === 1 ? USDTContractEthereum : USDTContractBNB;
        const contract = new ethers.Contract(
          contractAddress,
          TetherUSdtAbi,
          provider
        );
        const balance = await contract.balanceOf(address);
        const formattedBalance = ethers.utils.formatUnits(balance, 6);
        console.log("USDT balance:", formattedBalance);
        setUSDTBalance(parseFloat(formattedBalance));
      }
    } catch (error) {
      console.error("Error fetching USDT balance:", error);
    }
  };

  const Buy6osfromETH = async () => {
    try {
      if (!address) {
        alert("Please connect your wallet first.");
        return;
      }

      if (!ethAmount || isNaN(ethAmount)) {
        setEthAmountError("Please enter a valid amount.");
        return;
      } else {
        setEthAmountError("");
      }

      // Check if enough ETH balance is available
      if (parseFloat(ethBalance) < parseFloat(ethAmount)) {
        console.log("Insufficient balance to perform transaction.");
        alert("You do not have enough funds to buy tokens.");
        return;
      }

      let selectedMainContract;
      if (chainId === 1) {
        selectedMainContract = contractAddressETH;
      } else {
        selectedMainContract = contractAddressBSC;
      }
      let provider = new ethers.providers.Web3Provider(walletProvider);
      console.log("New Provider Connected!");
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        selectedMainContract,
        TokenSaleAbi,
        signer
      );

      // Estimate gas limit
      const gasLimit = await contract.estimateGas.buyTokensWithEth({
        value: ethers.utils.parseEther(ethAmount),
      });
      console.log("Estimated Gas Limit:", gasLimit.toString());

      // Fetch gas price
      const gasPrice = await provider.getGasPrice();
      console.log("Gas Price:", gasPrice.toString());

      // Send transaction
      const tx = await contract.buyTokensWithEth({
        value: ethers.utils.parseEther(ethAmount),
        gasLimit: gasLimit,
        gasPrice: gasPrice,
      });

      const receipt = await tx.wait();
      console.log("Transaction successful:", receipt);

      const transactionHash = receipt.transactionHash;
      console.log("Transaction Hash:", transactionHash);

      setEtherTrxHash(transactionHash);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  const Buy6osfromUSDT = async () => {
    try {
      // Ensure wallet is connected and authorized
      if (!address) {
        alert("Please connect your wallet first.");
        return;
      }

      // Ensure USDT amount is provided and valid
      if (!usdtAmount || isNaN(usdtAmount)) {
        setUSDTAmountError("Please enter a valid amount of USDT.");
        return;
      } else {
        setUSDTAmountError("");
      }

      // Check if enough USDT balance is available
      if (parseFloat(usdtBalance) < parseFloat(usdtAmount)) {
        console.log("Insufficient USDT balance to perform transaction.");
        alert("You do not have enough USDT to buy tokens.");
        return;
      }

      // Convert usdtAmount to Wei
      const usdtWeiAmount = ethers.utils.parseUnits(usdtAmount, 6);
      let selectedContractAddress;
      let selectedMainContract;
      if (chainId === 1) {
        selectedMainContract = contractAddressETH;
        selectedContractAddress = USDTContractEthereum;
      } else {
        selectedContractAddress = USDTContractBNB;
        selectedMainContract = contractAddressBSC;
      }
      let provider = new ethers.providers.Web3Provider(walletProvider);

      const signer = provider.getSigner();
      // Approve the contract to spend USDT on behalf of the user
      const usdtContract = new ethers.Contract(
        selectedContractAddress,
        TetherUSdtAbi,
        signer
      );
      const allowance = await usdtContract.allowance(
        address,
        selectedMainContract
      );

      if (allowance.lt(usdtWeiAmount)) {
        const approveTx = await usdtContract.approve(
          selectedMainContract,
          usdtWeiAmount
        );
        await approveTx.wait();
      }

      // Execute the transaction
      const contract = new ethers.Contract(
        selectedMainContract,
        TokenSaleAbi,
        signer
      );
      const gasLimit = await contract.estimateGas.buyTokensWithUSDT(
        usdtWeiAmount
      );
      console.log("Estimated Gas Limit:", gasLimit.toString());

      const gasPrice = await provider.getGasPrice();
      console.log("Gas Price:", gasPrice.toString());

      const tx = await contract.buyTokensWithUSDT(usdtWeiAmount, {
        gasLimit: gasLimit,
        gasPrice: gasPrice,
      });

      const receipt = await tx.wait();
      console.log("Transaction successful:", receipt);

      const transactionHash = receipt.transactionHash;
      console.log("Transaction Hash:", transactionHash);

      setusdtTrxHash(transactionHash);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };
  // Function to handle changes in USDT input
  const handleUsdtInputChange = (event) => {
    const amount = event.target.value;
    setUsdtAmount(amount);
    if (amount !== "") {
      const calculatedTokenAmount = amount * 1000; // Convert USDT to 6ENSE
      setSixensetokenAmount(calculatedTokenAmount.toFixed(2)); // Round to 2 decimal places
    } else {
      setSixensetokenAmount("");
    }
  };

  // Function to handle changes in ETH input
  const handleEthInputChange = (event) => {
    const amount = event.target.value;
    setEthAmount(amount);
    if (amount !== "") {
      if (chainId === 1) {
        const calculatedTokenAmount = (amount * 3294.43) / 0.001; // Convert ETH to 6ENSE
        setTokenAmount(calculatedTokenAmount.toFixed(4)); // Round to 2 decimal places
      } else {
        const calculatedTokenAmount = (amount * 564.86) / 0.001; // Convert BNB to 6ENSE
        setTokenAmount(calculatedTokenAmount.toFixed(4)); // Round to 2 decimal places
      }
    } else {
      setTokenAmount("");
    }
  };

  // Function to get truncated wallet address
  // const getTruncatedAddress = (address) => {
  //   if (!address) return "";
  //   const start = address.substring(0, 6); // Get first 6 characters
  //   const end = address.substring(address.length - 4); // Get last 4 characters
  //   return `${start}...${end}`;
  // };

  // const switchActiveChain = async (chainId) => {
  //   try {
  //     await window.ethereum.request({
  //       method: "wallet_switchEthereumChain",
  //       params: [{ chainId: chainId }],
  //     });
  //     window.location.reload();
  //   } catch (switchError) {
  //     if (switchError.code === 4902) {
  //       // You can make a request to add the chain to wallet here
  //       console.log("Error", switchError);
  //       alert("Please add the Selected Chain in your MetaMask");
  //     }
  //     alert("Error Switching Chain!");
  //   }
  // };

  // Render conversion rate message
  // const renderConversionRateOfEth = () => {
  //   return (
  //     <div className="text-center py-2">
  //       1 60s = 0.0000046 ETH
  //     </div>
  //   );
  // };

  // const renderConversionRateofUsdt = () => {
  //   return (
  //     <div className="text-center py-2">
  //       1 60s = $0.016
  //     </div>
  //   );
  // };
  //

  return (
    <div className="border-2 max-w-[440px] w-full bg-[#6254ff] rounded-3xl p-2 pb-6 sm:p-4 lg:p-6">
      <div className="py-4">
        <h1 className="text-center text-white textBlack font-bold text-2xl">
          BUY NOW BEFORE FINAL LISTING!
        </h1>
      </div>
      <div className="py-6">
        <div className="flex items-center justify-around bg-white textWhite rounded-3xl py-2 px-4">
          <div className="border-2 border-[#6254ff]  rounded-full">
            <img src={osImg} alt="60S" className="w-6 h-6" />
          </div>
          <div>
            {" "}
            <p className="text-l text-[#6254ff] font-bold">1 60S = $0.00093 EUR</p>
            {/* <p className="text-sm">(USD, ETH, EUR conversion todo)</p> */}
          </div>
          <div className="border-2 bg-[#6254ff] p-1 rounded-full">
            <RiMoneyEuroCircleLine size={20} />
          </div>
        </div>
      </div>

      <div className="py-4">
        <div className="flex items-center justify-between textWhite">
          <div className="rounded-lg py-1 px-1 flex items-center flex-wrap justify-center gap-1">
            <div
              className={`flex items-center justify-center text-center w-[48%] flex-nowrap gap-x-1.5 uppercase py-2 px-3 rounded-md cursor-pointer ${activate === "ETH" ? "bg-white text-[#6254ff]" : "bgBlack"
                }`}
              onClick={() => setActivate("ETH")}
            >
              {chainId === 1 ? (
                <>
                  <FaEthereum /> eth
                </>
              ) : (
                <>BNB</>
              )}
            </div>
            <div
              className={`flex items-center justify-center text-center w-[48%] flex-nowrap gap-x-1.5 uppercase py-2 px-3 rounded-md  cursor-pointer ${activate === "USDT" ? "bg-white text-[#6254ff]" : "bgBlack"
                }`}
              onClick={() => setActivate("USDT")}
            >
              <FaHandHoldingUsd /> usdt
            </div>
            <div
              className={`flex items-center justify-center text-center w-[48%] flex-nowrap gap-x-1.5 uppercase py-2 px-3 rounded-md  cursor-pointer ${activate === "CARD" ? "bg-white text-[#6254ff]" : "bgBlack"
                }`}
            >
              <FaRegCreditCard />
              <WertComponent />
            </div>
            <div
              className={`flex items-center justify-center text-center w-[48%] flex-nowrap gap-x-1.5 uppercase py-2 px-3 rounded-md  cursor-pointer ${activate === "BANK TRANSFER" ? "bg-white text-[#6254ff]" : "bgBlack"
                }`}
              onClick={openModal} // Open modal on click
            >
              <button>Bank Transfer</button>
            </div>
          </div>
        </div>
        <div>
          {activate === "ETH" && (
            <div>
              <div className="py-8 flex flex-wrap sm:flex-nowrap items-center justify-center gap-4">
                <input
                  type="number"
                  value={ethAmount}
                  onChange={handleEthInputChange}
                  className=" text-center focus:outline-none max-w-[300px] py-3 px-3 rounded remove-arrow  w-full"
                  placeholder="Amount n"
                />
                <input
                  type="number"
                  value={tokenAmount}
                  className="text-center bg-white remove-arrow focus:outline-none max-w-[300px] py-3 px-3 rounded   w-full"
                  placeholder={`6ense Received`}
                  disabled
                />
              </div>
              {ethAmountError && (
                <div className="py-2 text-red-500 text-center">
                  {ethAmountError}
                </div>
              )}
              <div className="py-1 flex justify-center items-center">
                <button
                  className="bg-black text-white font-semibold remove-arrow text-center focus:outline-none max-w-[300px] py-3 px-3 rounded   w-full"
                  onClick={Buy6osfromETH}
                >
                  Buy With {chainId === 1 ? "ETH" : "BNB"}
                </button>
              </div>
              <p className="my-2 font-semibold text-base text-center text-white">
                Transaction Hash: {EtherTrxHash}
              </p>
            </div>
          )}
          {activate === "USDT" && (
            <div>
              <div className="py-8 flex flex-wrap sm:flex-nowrap items-center justify-center gap-4">
                <input
                  type="number"
                  value={usdtAmount}
                  onChange={handleUsdtInputChange}
                  className="text-center focus:outline-none max-w-[300px] py-3 px-3 rounded remove-arrow  w-full"
                  placeholder="Amount in USDT"
                />
                <input
                  type="number"
                  value={SixensetokenAmount}
                  className="bg-white text-center focus:outline-none max-w-[300px] py-3 px-3 rounded  remove-arrow w-full"
                  placeholder={`6ense Recieved`}
                  disabled
                />
              </div>
              {USDTAmountError && (
                <div className="py-2 text-red-500 text-center">
                  {USDTAmountError}
                </div>
              )}
              <div className="py-2 flex justify-center items-center">
                <button
                  className="bg-black text-white font-semibold remove-arrow text-center focus:outline-none max-w-[300px] py-3 px-3 rounded   w-full"
                  onClick={Buy6osfromUSDT}
                >
                  Buy With USDT
                </button>
              </div>
              <p className="my-2 font-semibold text-base text-center text-white ">
                Transaction Hash: {usdtTrxHash}
              </p>
            </div>
          )}
          {activate === "CARD" && (
            <div className="pt-9">
              <div className="py-1 flex justify-center items-center">
                <Button name={"Buy With Credit"} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal component */}
      <BankTransferModal isOpen={isModalOpen} onClose={closeModal} />

      <div className="py-3 flex text-white flex-wrap sm:flex-nowrap items-center justify-center gap-4">
        <WalletComponent />
      </div>
    </div>
  );
};

export default HeroRight;

/* eslint-disable no-undef */
import WertWidget from "@wert-io/widget-initializer";
import ChildComponent from "./CreditCardButton"; // Assuming ChildComponent is in the same directory

import { Buffer } from "buffer/";
import { signSmartContractData } from "@wert-io/widget-sc-signer";

window.Buffer = Buffer; // needed to use `signSmartContractData` in browser

const WertComponent = () => {
  const signedData = signSmartContractData(
    {
      address: process.env.NEXT_PUBLIC_WALLET_ADDRESS,
      commodity: "ETH",
      network: "ethereum",
      commodity_amount: 0.005,
      sc_address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      sc_input_data: "",
    },
    process.env.NEXT_PUBLIC_PKEY
  );
  const wertWidget = new WertWidget({
    partner_id: process.env.NEXT_PUBLIC_PARTNER_ID,
    ...signedData,
    // extra: {
    //   item_info: {
    //     author_image_url: "string", //Example: https://something.com/images/author_image.jpg
    //     author: "Item's Author",
    //     image_url: "string", //Example: https://something.com/images/image.jpg
    //     name: "Item's Name",
    //     category: "Item's Category",
    //     header: "Custom Header",
    //   },
    // },
  });

  const openWidget = () => {
    wertWidget.open();
  };

  return (
    <div>
      <ChildComponent onButtonClick={openWidget} />
      {/* Initialize the widget when the parent component mounts */}
    </div>
  );
};

export default WertComponent;

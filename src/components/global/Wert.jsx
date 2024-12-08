import { useRef } from "react";
import WertWidget from "@wert-io/widget-initializer";
import { v4 as uuidv4 } from "uuid";
import ChildComponent from "./CreditCardButton"; // Assuming ChildComponent is in the same directory

const WertComponent = () => {
  const wertWidgetRef = useRef(null);

  const initializeWidget = () => {
    const options = {
      partner_id: "01HBV2MRPQJZKZH0V4YE5XWK2C",
      click_id: uuidv4(), // unique id of purchase in your system
      origin: "https://sandbox.wert.io", // this option needed only in sandbox
      commodity: "6OS",
      network: "sepolia",
      commodities: JSON.stringify([
        {
          commodity: "ETH",
          network: "sepolia",
        },
      ]),
      listeners: {
        loaded: () => console.log("loaded"),
      },
    };

    wertWidgetRef.current = new WertWidget(options);
  };

  const openWidget = () => {
    if (wertWidgetRef.current) {
      wertWidgetRef.current.open();
    }
  };

  return (
    <div>
      <ChildComponent onButtonClick={openWidget} />
      {/* Initialize the widget when the parent component mounts */}
      {initializeWidget()}
    </div>
  );
};

export default WertComponent;

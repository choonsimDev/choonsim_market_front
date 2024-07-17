import { useState } from "react";
import { BuyFirstStepComponent } from "./BuyFirstStepComponent";
import { OrderType } from "@/lib/types/order";
import { BuySecondStepComponent } from "./BuySecondStepComponent";
import { BuyThirdStepComponent } from "./BuyThirdStepComponent";
import { BuyFourthStepComponent } from "./BuyFourthStepComponent";

export const BuyComponent = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<any>({
    type: OrderType.BUY,
    amount: 0,
    price: 0,
    phoneNumber: "",
    blockchainAddress: "",
    bankName: "",
    accountNumber: "",
    nickname: "",
    username: "",
  });
  const [orderData, setOrderData] = useState();

  return (
    <>
      {step === 1 && (
        <BuyFirstStepComponent
          data={data}
          setData={setData}
          setStep={setStep}
        />
      )}
      {step === 2 && (
        <BuySecondStepComponent
          data={data}
          setData={setData}
          setStep={setStep}
          setOrderData={setOrderData}
        />
      )}
      {step === 3 && <BuyThirdStepComponent data={data} setStep={setStep} />}
      {step === 4 && <BuyFourthStepComponent orderData={orderData} />}
    </>
  );
};

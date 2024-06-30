import { useState } from "react";
import { SellFirstStepComponent } from "./SellFirstStepComponent";
import { OrderType } from "@/lib/types/order";
import { SellSecondStepComponent } from "./SellSecondStepComponent";
import { SellThirdStepComponent } from "./SellThirdStepComponent";
import { SellFourthStepComponent } from "./SellFourthStepComponent";

export const SellComponent = () => {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<any>({
        type: OrderType.SELL,
        amount: 0,
        price: 0,
        phoneNumber: '',
        blockchainAddress: '',
        bankName: '',
        accountNumber: '',
        nickname: '',
        username: '',
    });
    const [orderData, setOrderData] = useState();

    return(
        <>
            {step === 1 && <SellFirstStepComponent data={data} setData={setData} setStep={setStep} />}
            {step === 2 && <SellSecondStepComponent data={data} setData={setData} setStep={setStep} setOrderData={setOrderData}/>}
            {step === 3 && <SellThirdStepComponent data={data} setStep={setStep} />}
            {step === 4 && <SellFourthStepComponent orderData={orderData} />}
        </>
    )
}
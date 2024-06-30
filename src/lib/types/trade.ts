export interface Trade {
    id: string;
    buyOrderId: string;
    sellOrderId: string;
    amount: number;
    price: number;
    buyPhoneNumber: string;
    buyBlockchainAddress: string;
    buyAccountNumber: string;
    buyNickname: string;
    sellPhoneNumber: string;
    sellBlockchainAddress: string;
    sellAccountNumber: string;
    sellNickname: string;
    createdAt: Date;
  }
  
  export interface DailyTradeStat {
    date: string;
    averagePrice: number;
    closePrice: number;
    highPrice: number;
    lowPrice: number;
    totalAmount: number;
    totalPrice: number;
  }
  
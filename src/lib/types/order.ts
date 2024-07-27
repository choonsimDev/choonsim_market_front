export enum OrderType {
  BUY = "BUY",
  SELL = "SELL",
}

export interface Order {
  id: string;
  type: OrderType;
  amount: number;
  remainingAmount: number;
  price: number;
  phoneNumber: string;
  blockchainAddress: string;
  accountNumber: string;
  nickname: string;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  cancellationReason?: string;
  bankName: string;
  orderNumber: string;
}

export interface CreateOrderDto {
  type: OrderType;
  amount: number;
  price: number;
  phoneNumber: string;
  blockchainAddress: string;
  accountNumber: string;
  nickname: string;
  bankName: string;
}

export interface UpdateOrderStatusDto {
  status?: number;
  cancellationReason?: string; // only for status 3
  remainingAmount?: number; // only for status 1
}

export interface MatchOrderDto {
  sellOrderId: string;
  buyOrderId: string;
}

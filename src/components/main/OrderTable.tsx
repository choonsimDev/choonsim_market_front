import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getOrdersByStatus } from "@/lib/apis/order";
import { Order, OrderType } from "@/lib/types/order";
import { useRouter } from "next/router";

const TableContainer = styled.div`
  width: 100%;
  max-height: 500px;
  margin: 10px 0;
  font-size: 0.9em;
  font-family: "Arial", sans-serif;
  background-color: #f9f9f9;
  overflow-y: auto;
`;

const TableBlock = styled.div`
  padding-top: 18px;
  padding-bottom: 18px;
  font-weight: bold;
`;

const TableHead = styled.div`
  display: flex;
  justify-content: center;
  color: #333;
  font-weight: bold;
`;

const TableHeader = styled.div<{ $isBuy?: boolean; $isSell?: boolean }>`
  width: 100px;
  text-align: center;
  padding: 10px 0;
  color: ${(props) => (props.$isBuy ? "red" : props.$isSell ? "blue" : "#333")};
`;

const TableBody = styled.div``;

const TableRow = styled.div`
  display: flex;
  justify-content: center;
`;

const TableCell = styled.div<{ $isBuy?: boolean; $isSell?: boolean }>`
  width: 100px;
  text-align: center;
  padding: 10px 0;
  color: ${(props) => (props.$isBuy ? "red" : props.$isSell ? "blue" : "#333")};
`;

const OrderTable: React.FC = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await getOrdersByStatus(1);
      const sortedData = data.sort((a: any, b: any) => b.price - a.price);

      const aggregatedData = sortedData.reduce((acc: any, order: any) => {
        const existing = acc.find(
          (o: any) => o.price === order.price && o.type === order.type
        );
        if (existing) {
          existing.remainingAmount += order.remainingAmount;
        } else {
          acc.push({ ...order });
        }
        return acc;
      }, []);

      setOrders(aggregatedData);
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <TableContainer>
      <TableBlock>
        <TableHead>
          <TableHeader $isBuy>구매</TableHeader>
          <TableHeader>가격</TableHeader>
          <TableHeader $isSell>판매</TableHeader>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell
                $isBuy={order.type === OrderType.BUY}
                onClick={
                  order.type === OrderType.BUY
                    ? () => {
                        router.push(`/create-order/buy?price=${order.price}`);
                      }
                    : undefined
                }
              >
                {order.type === OrderType.BUY ? order.remainingAmount : "-"}
              </TableCell>
              <TableCell>{order.price.toLocaleString()}</TableCell>
              <TableCell
                $isSell={order.type === OrderType.SELL}
                onClick={
                  order.type === OrderType.SELL
                    ? () => {
                        router.push(`/create-order/sell?price=${order.price}`);
                      }
                    : undefined
                }
              >
                {order.type === OrderType.SELL ? order.remainingAmount : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableBlock>
    </TableContainer>
  );
};

export default OrderTable;

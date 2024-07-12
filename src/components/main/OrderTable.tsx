import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getOrdersByStatus } from "@/lib/apis/order";
import { Order, OrderType } from "@/lib/types/order";
import { useRouter } from "next/router";

interface TableProps {
  $isBuy?: boolean;
  $isSell?: boolean;
  $isLast?: boolean;
}

const TableContainer = styled.div`
  width: 100%;
  margin: 10px 0;
  font-size: 0.875rem;
  font-family: "Arial", sans-serif;
  overflow-y: auto;
  border: solid 2px #f5f5f5;
  border-radius: 10px;
  background-color: #fbfbfb;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.05);
`;

const TableBlock = styled.div`
  padding-top: 1.125rem;
  padding-bottom: 1.125rem;
  font-weight: bold;
  flex-grow: 1; /* Allow it to grow to take up available space */
`;

const TableHead = styled.div`
  display: flex;
  justify-content: center;
  color: #232323;
  font-weight: bold;
`;

const TableHeader = styled.div<TableProps>`
  width: 100px;
  text-align: center;
  font-size: 1.125rem;
  padding: 10px 0;
  color: ${(props) =>
    props.$isBuy ? "red" : props.$isSell ? "blue" : "#232323"};
  border-right: ${(props) => (props.$isLast ? "none" : "solid 2px #ededed")};
  border-bottom: solid 2px #ededed;
`;

const TableBody = styled.div`
  height: 45vh;
  overflow-y: auto;
`;

const TableRow = styled.div`
  display: flex;
  justify-content: center;
`;

const TableCell = styled.div<TableProps>`
  width: 100px;
  text-align: center;
  padding: 10px 0;
  color: ${(props) =>
    props.$isBuy ? "red" : props.$isSell ? "blue" : "#232323"};
  border-right: ${(props) => (props.$isLast ? "none" : "solid 2px #ededed")};
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

      // Filter the orders to only include those with today's date (KST)
      const today = new Date();
      const kstOffset = 9 * 60; // KST is UTC+9
      today.setMinutes(
        today.getMinutes() + today.getTimezoneOffset() + kstOffset
      );

      const todayDateString = today.toISOString().split("T")[0];
      const filteredData = aggregatedData.filter((order: Order) => {
        const orderDate = new Date(order.createdAt);
        orderDate.setMinutes(
          orderDate.getMinutes() + orderDate.getTimezoneOffset() + kstOffset
        );
        const orderDateString = orderDate.toISOString().split("T")[0];
        return orderDateString === todayDateString;
      });

      setOrders(filteredData);
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
          <TableHeader $isSell={true} $isLast={true}>
            판매
          </TableHeader>
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
                $isLast={true}
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

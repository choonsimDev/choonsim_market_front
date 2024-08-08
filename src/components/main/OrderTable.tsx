import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { getOrdersByStatus } from "@/lib/apis/order";
import { Order, OrderType } from "@/lib/types/order";
import { useRouter } from "next/router";

interface TableProps {
  $isBuy?: boolean;
  $isSell?: boolean;
  $isLast?: boolean;
}

interface AggregatedOrder {
  price: number;
  buyAmount: number;
  sellAmount: number;
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
  flex-grow: 1;
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
  display: flex;
  flex-direction: column;
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
  const [aggregatedOrders, setAggregatedOrders] = useState<AggregatedOrder[]>(
    []
  );
  const [previousRemainingAmounts, setPreviousRemainingAmounts] = useState<{
    [key: string]: number;
  }>({});
  const tableBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: dataStatus1 } = await getOrdersByStatus(1);
      const { data: dataStatus2 } = await getOrdersByStatus(2);

      const combinedData = [...dataStatus1, ...dataStatus2];

      // Filter the orders to only include those with today's date (KST)
      const today = new Date();
      const kstOffset = 9 * 60; // KST is UTC+9
      today.setMinutes(
        today.getMinutes() + today.getTimezoneOffset() + kstOffset
      );

      const todayDateString = today.toISOString().split("T")[0];
      const filteredData = combinedData.filter((order: Order) => {
        const orderDate = new Date(order.createdAt);
        orderDate.setMinutes(
          orderDate.getMinutes() + orderDate.getTimezoneOffset() + kstOffset
        );
        const orderDateString = orderDate.toISOString().split("T")[0];
        return orderDateString === todayDateString;
      });

      const aggregatedData = filteredData.reduce(
        (acc: AggregatedOrder[], order: Order) => {
          const existing = acc.find((o) => o.price === order.price);
          if (existing) {
            if (order.type === OrderType.BUY) {
              existing.buyAmount += order.remainingAmount;
            } else if (order.type === OrderType.SELL) {
              existing.sellAmount += order.remainingAmount;
            }
          } else {
            acc.push({
              price: order.price,
              buyAmount:
                order.type === OrderType.BUY ? order.remainingAmount : 0,
              sellAmount:
                order.type === OrderType.SELL ? order.remainingAmount : 0,
            });
          }
          return acc;
        },
        []
      );

      const validAggregatedData = aggregatedData.filter(
        (order: AggregatedOrder) => order.buyAmount > 0 || order.sellAmount > 0
      );

      const sortedData = validAggregatedData.sort(
        (a: AggregatedOrder, b: AggregatedOrder) => b.price - a.price
      );

      setAggregatedOrders(sortedData);
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    aggregatedOrders.forEach((order: AggregatedOrder) => {
      if (
        order.buyAmount !== previousRemainingAmounts[order.price] ||
        order.sellAmount !== previousRemainingAmounts[order.price]
      ) {
        scrollToPrice(order.price);
      }
    });
    setPreviousRemainingAmounts(
      aggregatedOrders.reduce((acc, order) => {
        acc[order.price] = order.buyAmount + order.sellAmount;
        return acc;
      }, {} as { [key: string]: number })
    );
  }, [aggregatedOrders]);

  const scrollToPrice = (price: number) => {
    if (tableBodyRef.current) {
      const rows = Array.from(
        tableBodyRef.current.children
      ) as HTMLDivElement[];
      let targetRow = rows.find((row) => {
        const cell = row.children[1] as HTMLDivElement;
        return cell && parseFloat(cell.innerText.replace(/,/g, "")) === price;
      });

      if (!targetRow) {
        const prices = rows.map((row) => {
          const cell = row.children[1] as HTMLDivElement;
          return parseFloat(cell.innerText.replace(/,/g, ""));
        });
        const closestPrice = prices.reduce((prev, curr) =>
          Math.abs(curr - price) < Math.abs(prev - price) ? curr : prev
        );
        targetRow = rows.find((row) => {
          const cell = row.children[1] as HTMLDivElement;
          return (
            cell &&
            parseFloat(cell.innerText.replace(/,/g, "")) === closestPrice
          );
        });
      }

      if (targetRow) {
        const targetPosition =
          targetRow.offsetTop -
          tableBodyRef.current.clientHeight / 2 +
          targetRow.clientHeight / 2;
        tableBodyRef.current.scrollTop = targetPosition;
      }
    }
  };

  return (
    <TableContainer>
      <TableBlock>
        <TableHead>
          <TableHeader $isBuy>구매</TableHeader>
          <TableHeader>가격</TableHeader>
          <TableHeader $isSell $isLast>
            판매
          </TableHeader>
        </TableHead>
        <TableBody ref={tableBodyRef}>
          {aggregatedOrders.map((order) => (
            <TableRow key={order.price}>
              <TableCell
                $isBuy
                onClick={() => {
                  router.push(
                    `/create-order/buy?price=${order.price.toFixed(2)}`
                  );
                }}
              >
                {order.buyAmount > 0 ? order.buyAmount.toFixed(2) : "-"}
              </TableCell>
              <TableCell>{order.price.toLocaleString()}</TableCell>
              <TableCell
                $isSell
                $isLast
                onClick={() => {
                  router.push(
                    `/create-order/sell?price=${order.price.toFixed(2)}`
                  );
                }}
              >
                {order.sellAmount > 0 ? order.sellAmount.toFixed(2) : "-"}
              </TableCell>
            </TableRow>
          ))}
          {orders
            .filter(
              (order) =>
                !aggregatedOrders.some(
                  (aggOrder) => aggOrder.price === order.price
                )
            )
            .map((order: Order) => (
              <TableRow key={order.id}>
                <TableCell
                  $isBuy={order.type === OrderType.BUY}
                  onClick={
                    order.type === OrderType.BUY
                      ? () => {
                          router.push(
                            `/create-order/buy?price=${order.price.toFixed(2)}`
                          );
                        }
                      : undefined
                  }
                >
                  {order.type === OrderType.BUY
                    ? order.remainingAmount.toFixed(2)
                    : "-"}
                </TableCell>
                <TableCell>{order.price.toLocaleString()}</TableCell>
                <TableCell
                  $isSell={order.type === OrderType.SELL}
                  $isLast={true}
                  onClick={
                    order.type === OrderType.SELL
                      ? () => {
                          router.push(
                            `/create-order/sell?price=${order.price.toFixed(2)}`
                          );
                        }
                      : undefined
                  }
                >
                  {order.type === OrderType.SELL
                    ? order.remainingAmount.toFixed(2)
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </TableBlock>
    </TableContainer>
  );
};

export default OrderTable;

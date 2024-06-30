import styled from "styled-components";
import StockInfoWrapper from "../common/StockInfo";
import { CreateOrderNav } from "./CreateOrderNav";

const CreateOrderComponentBlock = styled.div`
    padding-inline: 17px;
    flex: 1;
    display: flex;
    flex-direction: column;
`;

export const CreateOrderComponent = () => {
    return (
        <CreateOrderComponentBlock>
            <StockInfoWrapper />
            <CreateOrderNav />
        </CreateOrderComponentBlock>
    );
};
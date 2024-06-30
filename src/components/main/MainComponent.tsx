import styled from "styled-components";
import { SecondaryButton } from "../common/SecondaryButton";
import StockInfoWrapper from "../common/StockInfo";
import OrderTable from "./OrderTable";
import { useRouter } from "next/router";

const MainComponentBlock = styled.div`
    padding-inline: 17px;
    flex: 1;
`;

export const MainComponent = () => {
    const router = useRouter();
    return (
        <MainComponentBlock>
            <StockInfoWrapper />
            <OrderTable />
            <SecondaryButton onClick={() => {router.push('/create-order')}} text="심부름 신청하기" />
        </MainComponentBlock>
    );
};
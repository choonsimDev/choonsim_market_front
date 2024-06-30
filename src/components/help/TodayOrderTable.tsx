import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getTodayOrders } from '@/lib/apis/order';
import { Order } from '@/lib/types/order';
import Modal from 'react-modal';
import { SecondaryButton } from '../common/SecondaryButton';

Modal.setAppElement('#__next');

const TableContainer = styled.div`
  width: 100%;
  max-height: 600px;
  overflow-y: auto;
  margin: 10px 0;
  font-size: 0.9em;
  font-family: 'Arial', sans-serif;
  background-color: #E2E2E2;
`;

const TableBlock = styled.div`
  padding: 18px 0;
  font-weight: bold;
`;

const TableHead = styled.div`
  display: flex;
  justify-content: space-around;
  color: #333;
  font-weight: bold;
`;

const TableHeader = styled.div`
  flex: 1;
  text-align: center;
  padding: 10px 0;
`;

const TableBody = styled.div``;

const TableRow = styled.div`
  display: flex;
  justify-content: space-around;
`;

const TableCell = styled.div<StatusProps>`
  flex: 1;
  text-align: center;
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props => (props.status === 0 ? '#FF0000' : props.status === 1 ? '#00FFA3' : props.status === 3 ? 'rgb(0,0,0,0.5)' : 'black')};
`;

const CustomModal = styled(Modal)`
  position: absolute;
  top: 50%;
  left: 50%;
  right: auto;
  bottom: auto;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 10px;
  width: 80%;
  max-width: 400px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.5);
  outline: none;
`;

const InputContainer = styled.div`
  margin-bottom: 20px;
`;

const CustomInput = styled.input`
  width: 100%;
  border: none;
  border-bottom: 1px solid #ccc;
  margin: 10px 0;
  padding: 8px 0;
  font-size: 16px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #333;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
`;

const ModalHeader = styled.header`
  display: flex;
  align-items: center;
  background-color: #fff;
  justify-content: space-between;
  font-weight: bold;
  font-size: 14px;
  padding-bottom: 27px;
`;

const ModalStatusHeader = styled.div`
  font-size: 25px;
  color: #242731;
  font-weight: bold;
  text-align: center;
  padding-bottom: 17px;
`;

interface StatusProps {
    status?: number;
}

function maskNickname(nickname: string) {
    return `${nickname[0]}${'*'.repeat(nickname.length - 1)}`;
}

function formatStatus(status: number) {
    switch (status) {
        case 0:
            return '입금 확인 중';
        case 1:
            return '신청 완료';
        case 2:
            return '신청 완료';
        case 3:
            return '반환';
        default:
            return '';
    }
}

const TodayOrderTable: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [nicknameInput, setNicknameInput] = useState('');
    const [phoneNumberInput, setPhoneNumberInput] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            const { data } = await getTodayOrders();
            setOrders(data);
        };
        fetchOrders();
    }, []);

    const handleRowClick = (order: Order) => {
        setSelectedOrder(order);
        setShowVerificationModal(true);
    };

    const verifyDetails = () => {
        if (selectedOrder && nicknameInput === selectedOrder.nickname && phoneNumberInput === selectedOrder.phoneNumber) {
            setShowVerificationModal(false);
            setShowDetailsModal(true);
        } else {
            alert("Details do not match.");
        }
    };

    return (
        <TableContainer>
            <TableBlock>
                <TableHead>
                    <TableHeader>주문번호</TableHeader>
                    <TableHeader>닉네임</TableHeader>
                    <TableHeader>현재상태</TableHeader>
                </TableHead>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id} onClick={() => handleRowClick(order)}>
                            <TableCell style={{ fontSize: '8px' }}>{order.id}</TableCell>
                            <TableCell>{maskNickname(order.nickname)}</TableCell>
                            <TableCell status={order.status}>{formatStatus(order.status)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </TableBlock>
            <CustomModal isOpen={showVerificationModal} onRequestClose={() => setShowVerificationModal(false)}>
                <ModalHeader>
                    <div>접수번호: {selectedOrder?.id}</div>
                    <div><CloseButton onClick={() => {setShowVerificationModal(false); setNicknameInput(""); setPhoneNumberInput("")}}><img src="/svg/back.svg" alt="back" /></CloseButton></div>
                </ModalHeader>
                <InputContainer>
                    <Label>신청 닉네임</Label>
                    <CustomInput value={nicknameInput} onChange={(e) => setNicknameInput(e.target.value)} placeholder="신청 닉네임을 작성하세요" />
                </InputContainer>
                <InputContainer>
                    <Label>신청 전화번호</Label>
                    <CustomInput value={phoneNumberInput} onChange={(e) => setPhoneNumberInput(e.target.value)} placeholder="010-0000-0000" />
                </InputContainer>
                <SecondaryButton text="확인하기" onClick={verifyDetails} />
            </CustomModal>
            <CustomModal isOpen={showDetailsModal} onRequestClose={() => setShowDetailsModal(false)}>
                <ModalHeader>
                    <div>접수번호: {selectedOrder?.id}</div>
                    <div><CloseButton onClick={() => {setShowDetailsModal(false); setNicknameInput(""); setPhoneNumberInput("")}}><img src="/svg/back.svg" alt="back" /></CloseButton></div>
                </ModalHeader>
                <ModalStatusHeader>현재 상태: {formatStatus(selectedOrder?.status!)}</ModalStatusHeader>
                {selectedOrder?.status === 3 && 
                <InputContainer>
                    <Label>사유</Label>
                    <CustomInput value={selectedOrder?.cancellationReason || ''} readOnly />
                </InputContainer>}
                <InputContainer>
                    <Label>신청 닉네임</Label>
                    <CustomInput value={selectedOrder?.nickname} readOnly />
                </InputContainer>
                <InputContainer>
                    <Label>구분</Label>
                    <CustomInput value={selectedOrder?.type === 'BUY' ? '구매' : '판매'} readOnly />
                </InputContainer>
                <InputContainer>
                    <Label>신청 내용</Label>
                    <CustomInput value={`${selectedOrder?.price}원 / ${selectedOrder?.amount}개`} readOnly />
                </InputContainer>
                <InputContainer>
                    <Label>신청 계좌번호</Label>
                    <CustomInput value={selectedOrder?.accountNumber} readOnly />
                </InputContainer>
                <SecondaryButton text="돌아가기" onClick={() => {setShowDetailsModal(false); setNicknameInput(""); setPhoneNumberInput("")}} />
            </CustomModal>
        </TableContainer>
    );
};


export default TodayOrderTable;

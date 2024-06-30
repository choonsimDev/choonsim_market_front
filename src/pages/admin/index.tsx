import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Sidebar from '@/components/admin/Sidebar';
import { login, validateToken } from '@/lib/apis/auth';

const Admin = () => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await validateToken();
        setIsAuthenticated(true);
        setMessage('환영합니다, 관리자님');
        setSuccess(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  const handleLogin = async () => {
    try {
      const { data } = await login(code);
      setMessage(data.message);
      setSuccess(true);
      setIsAuthenticated(true);
      router.push('/admin/data');
    } catch (error) {
      console.log(error);
      setMessage("관리자 코드가 올바르지 않습니다.");
      setSuccess(false);
    }
  };

  return (
    <Container>
      <Sidebar />
      <Content>
        <Header>
          <Title>관리자 페이지</Title>
        </Header>
        {isAuthenticated ? (
          <Message success={success}>{message}</Message>
        ) : (
          <InputArea>
            <Label>관리자 코드:</Label>
            <Input 
              type="text" 
              placeholder="관리자 코드를 입력하세요" 
              value={code} 
              onChange={(e) => setCode(e.target.value)} 
            />
            <Button onClick={handleLogin}>로그인</Button>
            {message && <Message success={success}>{message}</Message>}
          </InputArea>
        )}
      </Content>
    </Container>
  );
};

export default Admin;

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  background: #f9f9f9;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 2rem;
  margin-left: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #555;
`;

const Input = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const Button = styled.button`
  margin-top: 1rem;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

interface MessageProps {
  success: boolean;
}

const Message = styled.p<MessageProps>`
  margin-top: 1rem;
  font-size: 1rem;
  color: ${props => (props.success ? 'green' : 'red')};
`;

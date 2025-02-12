import styled from 'styled-components';

const Button = styled.button`
  position: fixed;
  top: 2vh;
  right: 2vw;
  background-color: transparent;
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
  z-index: 1000;

  &:hover {
    color: #007bff;
  }
`;

const PcHamburgerButton = ({ onClick }) => {
  return <Button onClick={onClick}>☰ 메뉴</Button>;
};

export default PcHamburgerButton;

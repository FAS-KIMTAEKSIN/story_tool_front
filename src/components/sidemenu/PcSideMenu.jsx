import styled from 'styled-components';

const MenuWrapper = styled.div`
  position: fixed;
  top: 0;
  left: ${({ isOpen }) => (isOpen ? '0' : '-30vw')};
  width: 28vw;
  height: 100%;
  background-color: #f4f4f4;
  box-shadow: 0.3vw 0 0.6vw rgba(0, 0, 0, 0.2);
  transition: left 0.3s ease;
  z-index: 999;
`;

const MenuContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2vw;
`;

const MenuItem = styled.a`
  margin: 1vw 0;
  text-decoration: none;
  color: #333;

  &:hover {
    color: #007bff;
  }
`;

const PcSideMenu = ({ isOpen }) => {
  return (
    <MenuWrapper isOpen={isOpen}>
      <MenuContent>
        <MenuItem href="#home">Home</MenuItem>
        <MenuItem href="#about">About</MenuItem>
        <MenuItem href="#services">Services</MenuItem>
        <MenuItem href="#contact">Contact</MenuItem>
      </MenuContent>
    </MenuWrapper>
  );
};

export default PcSideMenu;

import styled from 'styled-components';

const Button = styled.button`
  position: relative;
  /* left: 4vw; */
  width: 4vw;
  height: 4vh;
  background-color: transparent;
  border: none;
  cursor: pointer;
  z-index: 1000;

  span {
    display: block;
    width: 7vw;
    height: 0.5vh;
    margin: 0.6vh 0;
    background-color: #333;
  }
`;

const MobileHamburgerButton = ({ onClick }) => {
  return (
    <Button onClick={onClick}>
      <span></span>
      <span></span>
      <span></span>
    </Button>
  );
};

export default MobileHamburgerButton;

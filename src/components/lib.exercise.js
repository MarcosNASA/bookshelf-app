import styled from '@emotion/styled/macro';
import {Dialog as ReachDialog} from '@reach/dialog';
import {FaSpinner} from 'react-icons/fa';
import {keyframes} from '@emotion/core';

import * as colors from 'styles/colors';

// 🐨 create a button styled component here called "Button"
// make it look nice and allow it to support a "variant" prop which can be
// either "primary" or "secondary".
// 💰 don't forget to export it at the bottom!
// 💰 In my final version, I style padding, border, lineHeight, and borderRadius
//    the same for both types, and then change the background and color based
//    on the given variant.
// 🦉 remember, you don't have to make things look perfect or just like they
// do in the final example. Just make sure you understand how to create the
// styled component and accept a prop to change which styles apply.

// 🐨 Feel free to create as many reusable styled components here as you'd like
// 💰 in my finished version I have: Button, Input, CircleButton, Dialog, FormGroup

// 🎨 here are a bunch of styles you can copy/paste if you want
// Button:
//   padding: '10px 15px',
//   border: '0',
//   lineHeight: '1',
//   borderRadius: '3px',

// Button variant="primary" (in addition to the above styles)
//   background: '#3f51b5',
//   color: 'white',

// Button variant="secondary" (in addition to the above styles)
//   background: '#f1f2f7',
//   color: '#434449',

const buttonVariants = {
  primary: {
    background: colors.indigo,
    color: colors.base,
  },
  secondary: {
    background: colors.gray10,
    color: colors.text,
  },
};

const Button = styled.button(({variant}) => {
  return {
    padding: '10px 15px',
    border: '0',
    lineHeight: '1',
    borderRadius: '3px',
    ...(buttonVariants[variant] || {}),
  };
});

// Input
//   borderRadius: '3px',
//   border: '1px solid #f1f1f4',
//   background: '#f1f2f7',
//   padding: '8px 12px',

const Input = styled.input({
  borderRadius: '3px',
  border: `1px solid ${colors.gray10}`,
  background: colors.gray,
  padding: '8px 12px',
});

// FormGroup
//   display: 'flex',
//   flexDirection: 'column',
const FormGroup = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

// 💰 I'm giving a few of these to you:
const CircleButton = styled.button({
  borderRadius: '30px',
  padding: '0',
  width: '40px',
  height: '40px',
  lineHeight: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: colors.base,
  color: colors.text,
  border: `1px solid ${colors.gray10}`,
  cursor: 'pointer',
});

const Dialog = styled(ReachDialog)({
  maxWidth: '450px',
  borderRadius: '3px',
  paddingBottom: '3.5em',
  boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.2)',
  margin: '20vh auto',
  '@media (max-width: 991px)': {
    width: '100%',
    margin: '10vh auto',
  },
});

const spin = keyframes({
  '0%': {transform: 'rotate(0deg)'},
  '100%': {transform: 'rotate(360deg)'},
});

const Spinner = styled(FaSpinner)(({customAnimation}) => ({
  /* styles here */
  animation: `${spin} 1s ease infinite`,
  ...customAnimation,
}));

export {CircleButton, Dialog, Button, Input, FormGroup, Spinner};

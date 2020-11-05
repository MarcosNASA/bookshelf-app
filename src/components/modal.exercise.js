/** @jsx jsx */
import {jsx} from '@emotion/core';
// 🐨 you're going to need the Dialog component
// It's just a light wrapper around ReachUI Dialog
// 📜 https://reacttraining.com/reach-ui/dialog/
import * as React from 'react';
import VisuallyHidden from '@reach/visually-hidden';
import {Dialog, CircleButton} from './lib';

// 💰 Here's a reminder of how your components will be used:
/*
<Modal>
  <ModalOpenButton>
    <button>Open Modal</button>
  </ModalOpenButton>
  <ModalContents aria-label="Modal label (for screen readers)">
    <ModalDismissButton>
      <button>Close Modal</button>
    </ModalDismissButton>
    <h3>Modal title</h3>
    <div>Some great contents of the modal</div>
  </ModalContents>
</Modal>
*/

// we need this set of compound components to be structurally flexible
// meaning we don't have control over the structure of the components. But
// we still want to have implicitely shared state, so...
// 🐨 create a ModalContext here with React.createContext

const ModalStateContext = React.createContext();
const ModalDispatchContext = React.createContext();

// 🐨 create a Modal component that manages the isOpen state (via useState)
// and renders the ModalContext.Provider with the value which will pass the
// isOpen state and setIsOpen function

function Modal({children}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <ModalStateContext.Provider value={isOpen}>
      <ModalDispatchContext.Provider value={setIsOpen}>
        {children}
      </ModalDispatchContext.Provider>
    </ModalStateContext.Provider>
  );
}

function callAll(...fns) {
  return (...args) => {
    for (const fn of fns) {
      // eslint-disable-next-line no-unused-expressions
      typeof fn === 'function' ? fn(...args) : undefined;
    }
  };
}

// 🐨 create a ModalDismissButton component that accepts children which will be
// the button which we want to clone to set it's onClick prop to trigger the
// modal to close
// 📜 https://reactjs.org/docs/react-api.html#cloneelement
// 💰 to get the setIsOpen function you'll need, you'll have to useContext!
// 💰 keep in mind that the children prop will be a single child (the user's button)
function ModalDismissButton({children: child}) {
  const setIsOpen = React.useContext(ModalDispatchContext);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      {React.cloneElement(child, {
        onClick: callAll(closeModal, child.props.onClick),
      })}
    </>
  );
}

// 🐨 create a ModalOpenButton component which is effectively the same thing as
// ModalDismissButton except the onClick sets isOpen to true

function ModalOpenButton({children: child}) {
  const setIsOpen = React.useContext(ModalDispatchContext);

  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <>
      {React.cloneElement(child, {
        onClick: callAll(openModal, child.props.onClick),
      })}
    </>
  );
}

// 🐨 create a ModalContent component which renders the Dialog.
// Set the isOpen prop and the onDismiss prop should set isOpen to close
// 💰 be sure to forward along the rest of the props (especially children).

function ModalContentsBase({children, ...props}) {
  const isOpen = React.useContext(ModalStateContext);

  return isOpen ? <Dialog {...props}>{children}</Dialog> : null;
}

function ModalContents({title, children, ...props}) {
  const isOpen = React.useContext(ModalStateContext);

  return isOpen ? (
    <ModalContentsBase {...props}>
      <ModalDismissButton>
        <div css={{display: 'flex', justifyContent: 'flex-end'}}>
          <CircleButton>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>×</span>
          </CircleButton>
        </div>
      </ModalDismissButton>
      <h3 css={{textAlign: 'center', fontSize: '2em'}}>{title}</h3>
      {children}
    </ModalContentsBase>
  ) : null;
}

// 🐨 don't forget to export all the components here
export {
  Modal,
  ModalContentsBase,
  ModalContents,
  ModalDismissButton,
  ModalOpenButton,
};

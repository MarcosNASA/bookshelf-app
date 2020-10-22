// 🐨 make sure to add the comment and import jsx from @emotion/core
// up here so you can use the css prop
/** @jsx jsx */
import {jsx} from '@emotion/core';

// 🐨 let's get a solid reset of global styles so everything looks a bit better
// In this project we're using bootstrap-reboot which you can import from
// bootstrap/dist/css/bootstrap-reboot.css
// 🦉 Note: you can definitely use regular styles to style React apps
// and using any modern toolchain will allow you to simply import the CSS file
// but CSS-in-JS is generally easier to maintain.
import 'bootstrap/dist/css/bootstrap-reboot.css';
import '@reach/dialog/styles.css';
import React from 'react';
import ReactDOM from 'react-dom';
// 🐨 you'll need to import some new components that you'll be creating
// in this file
import {Button, Input, FormGroup, Spinner} from './components/lib';
import {Modal, ModalContents, ModalOpenButton} from './components/modal';
import {Logo} from './components/logo';

function LoginForm({onSubmit, submitButton}) {
  function handleSubmit(event) {
    event.preventDefault();
    const {username, password} = event.target.elements;

    onSubmit({
      username: username.value,
      password: password.value,
    });
  }

  // 🐨 this <form> could use a css prop
  // 🎨
  //    display: 'flex',
  //    flexDirection: 'column',
  //    alignItems: 'stretch',
  //    '> div': {
  //      margin: '10px auto',
  //      width: '100%',
  //      maxWidth: '300px',
  //    },
  return (
    <form
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        '> div': {
          margin: '10px auto',
          width: '100%',
          maxWidth: '300px',
        },
      }}
      onSubmit={handleSubmit}
    >
      {/* 🐨 these div elements could be a FormGroup you create in components/lib */}
      {/* 🐨 and the inputs elements could be custom styled Input components too */}
      <FormGroup>
        <label htmlFor="username">Username</label>
        <Input id="username" />
      </FormGroup>
      <FormGroup>
        <label htmlFor="password">Password</label>
        <Input id="password" type="password" />
      </FormGroup>
      <div>{React.cloneElement(submitButton, {type: 'submit'})}</div>
    </form>
  );
}

function App() {
  const [isLoaded, setIsLoaded] = React.useState(false);

  function login(formData) {
    console.log('login', formData);
  }

  function register(formData) {
    console.log('register', formData);
  }

  React.useEffect(() => {
    setTimeout(() => setIsLoaded(true), 3000);
  }, [setIsLoaded]);

  // 🐨 this div could use a css prop to get its children rendered nicer
  // 🎨
  //    display: 'flex',
  //    flexDirection: 'column',
  //    alignItems: 'center',
  //    justifyContent: 'center',
  //    width: '100%',
  //    height: '100vh',
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      {isLoaded ? (
        <>
          <Logo width="80" height="80" />
          <h1>Bookshelf</h1>
          {/*
        🐨 the two buttons are too close, let's space them out
          🎨 apply this to the div right below
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gridGap: '0.75rem',
      */}
          {/* 🐨 And make sure to use the new Button component for all these buttons */}
          <div
            css={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gridGap: '0.75rem',
            }}
          >
            <Modal>
              <ModalOpenButton>
                <Button variant="primary">Login</Button>
              </ModalOpenButton>
              <ModalContents aria-label="Login form" title="Login">
                <LoginForm
                  onSubmit={login}
                  submitButton={<Button variant="primary">Login</Button>}
                />
              </ModalContents>
            </Modal>
            <Modal>
              <ModalOpenButton>
                <Button variant="secondary">Register</Button>
              </ModalOpenButton>
              <ModalContents aria-label="Registration form" title="Register">
                <LoginForm
                  onSubmit={register}
                  submitButton={<Button variant="secondary">Register</Button>}
                />
              </ModalContents>
            </Modal>
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

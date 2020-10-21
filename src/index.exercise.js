// 🐨 you'll need to import React and ReactDOM up here
import React from 'react';
import ReactDOM from 'react-dom';
// 🐨 you'll also need to import the Logo component from './components/logo'
import {Logo} from './components/logo';
// 🐨 create an App component here and render the logo, the title ("Bookshelf"), a login button, and a register button.
// 🐨 for fun, you can add event handlers for both buttons to alert that the button was clicked
import {Dialog, DialogContent} from '@reach/dialog';
import '@reach/dialog/styles.css';

function LoginForm() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  function onUsernameChange(event) {
    setUsername(event.target.value);
  }

  function onPasswordChange(event) {
    setPassword(event.target.value);
  }

  function onSubmit(event) {
    event.preventDefault();

    const usernameInput = event.target.username.value;
    const passwordInput = event.target.password.value;

    console.log({usernameInput, passwordInput});
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="username">Username:</label>
      <input
        id="username"
        name="username"
        type="text"
        value={username}
        onChange={onUsernameChange}
      />
      <label htmlFor="password">Password:</label>
      <input
        id="password"
        type="password"
        name="password"
        value={password}
        onChange={onPasswordChange}
      />
      <button type="submit">Login</button>
    </form>
  );
}

function App() {
  const [openModal, setOpenModal] = React.useState('');

  const openLogin = () => {
    setOpenModal('login');
  };
  const openRegister = () => {
    setOpenModal('register');
  };

  return (
    <>
      <Logo />
      <h1>Bookshelf</h1>
      <button onClick={openLogin}>Login</button>
      <button onClick={openRegister}>Register</button>
      {openModal === 'login' ? (
        <Dialog>
          <DialogContent>
            <LoginForm />
          </DialogContent>
        </Dialog>
      ) : null}
      {openModal === 'register' ? <Dialog /> : null}
    </>
  );
}
// 🐨 use ReactDOM to render the <App /> to the root element
// 💰 find the root element with: document.getElementById('root')
ReactDOM.render(<App />, document.getElementById('root'));

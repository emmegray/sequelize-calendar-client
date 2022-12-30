import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState({})
  const [token, setToken] = useState("")

  return (
    <div className="App">
      <header className="App-header">
        {!token && <LoginForm
          onSuccess={data => {
            setUser(data.user)
            setToken(data.token)
          }}
        />}

        {token && <EventList token={token} user={user} />}
      </header>
    </div>
  );
}

function EventList({
  token, user
}) {
  const [events, setEvents] = useState([])

  async function fetchEvents() {
    try {
      const response = await fetch(
        `//localhost:5000/events`,
        { headers: { authorization: `Bearer ${token}` } }
      );
      const json = await response.json();
      setEvents(json.data || []);
    } catch (error) {
      setEvents([]);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, [user.id, token])

  return (
    <>
      <ul>{events.map(
        event => <li key={event.id}>
          <b>{event.title}</b>
          <br />
          <em>{event.description}</em>
        </li>
      )}</ul>
      <button onClick={fetchEvents}>refresh</button>
    </>
  )
}

function LoginForm({
  onSuccess
}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  async function onLogin(e) {
    e.preventDefault();
    let _error = []

    if (!username) {
      _error.push('Username empty')
    }

    if (!password) {
      _error.push('Password empty')
    }

    if (_error.length) {
      setErrorMessage(_error.join('; '))
      return
    } else {
      setErrorMessage('')
    }

    try {

      const response = await fetch('//localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username, password
        })
      });

      const json = await response.json();

      onSuccess(json.data)

    } catch (error) {
      console.error(error);
    }


  }

  return (
    <form>
      <b>Username</b>
      <input type="text" name='username' id='username' onChange={e => setUsername(e.target.value)} value={username} />
      <b>Password</b>
      <input type="password" name="password" id="password" onChange={e => setPassword(e.target.value)} value={password} />
      {errorMessage && (<b className='errorMessage'>{errorMessage}</b>)}
      <button type="submit" onClick={onLogin}>Login</button>
    </form>
  )
}

export default App;

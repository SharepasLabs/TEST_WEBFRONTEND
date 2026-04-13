import { useState, useEffect } from 'react';

function App() {
  const [greeting, setGreeting] = useState('Loading…');

  useEffect(() => {
    fetch('/api/hello')
      .then((res) => res.json())
      .then((data) => setGreeting(data.message))
      .catch(() => setGreeting('Hello World!'));
  }, []);

  return (
    <div className="container">
      <h1>{greeting}</h1>
      <p>A React (Vite) + Express hello world.</p>
    </div>
  );
}

export default App;

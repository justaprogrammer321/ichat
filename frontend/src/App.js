import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
const socket = io.connect('http://localhost:3001');

function App() {
  const [message, setMessage] = useState('');
  const [totalclient, setTotalclient] = useState(0);
  const [messageRecieved, setMessageRecieved] = useState('');
  const [pairedDevice, setPairedDevice] = useState('');

  const sendMessage = () => {
    socket.emit('send_message', { message });
  };

  useEffect(() => {
    socket.on('recieve_message', (data) => {
      setMessageRecieved(data.message);
    });

    socket.on('total_num', (totalnum) => {
      setTotalclient(totalnum);
    });

    socket.on('paired', (deviceId) => {
      setPairedDevice(deviceId);
    });

    return () => {
      socket.off('recieve_message');
      socket.off('total_num');
      socket.off('paired');
    };
  }, []);

  return (
    <div className="App">
      <h2>Total people: {totalclient}</h2>
      {pairedDevice && <h3>Paired with: {pairedDevice}</h3>}
      <input
        type="text"
        placeholder="Message.."
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button onClick={sendMessage}>Send Message</button>
      <h1>Message:</h1>
      {messageRecieved}
    </div>
  );
}

export default App;

<<<<<<< HEAD
import "leaflet/dist/leaflet.css";
=======
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext'; // <--- Import this

<<<<<<< HEAD

=======
>>>>>>> c48dede7c156c24ab5385f80fb7b08da9994282a
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>  {/* <--- Wrap App with AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
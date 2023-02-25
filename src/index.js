import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import './index.css';
import App from './App';
import { AuthProvider } from './utils/auth';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RecoilRoot>
    <AuthProvider>
      <App />
    </AuthProvider>
  </RecoilRoot>
);

import React from 'react';
import './App.css';
import Forms from './Component/Form'

function App() {
  return (
    <div className='Main' style={{backgroundImage:`url('./Back.jpg')`}}>
    <img src='./Raisely.png' width='400px' height='100px' />
    <Forms/>
    </div>
  );
}

export default App;

import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Navbar from '../components/Navbar'
import Jumbotro from '../components/Jumbotron';
import Card from '../components/Card';


// const App: React.FC = () => {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

const App: React.FC = () => {
  return (
    <div className="App">
      <Navbar />
      <div>
        <Jumbotro />
      </div>
      <div>
        <Card />
      </div>
    </div>
  );
}

export default App;

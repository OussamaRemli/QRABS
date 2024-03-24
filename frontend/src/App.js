import './App.css';
import Auth from './components/Auth';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/*<Route exact path='/' element={<Auth />} />*/}
          <Route exact path='/home/:id' element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

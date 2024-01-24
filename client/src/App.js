import './App.css';


//import compnents
import Search from './components/search.js';
import Register from './components/register.js';
import PolicyDisplay from './components/policyDisplay.js';

function App() {
  return (
    <div>
      <Search/>
      <Register/>
      <PolicyDisplay/>
    </div>
  );
}

export default App;

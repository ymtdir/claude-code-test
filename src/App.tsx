import { BrowserRouter } from 'react-router-dom';
import { AppNavigator } from './navigation/AppNavigator';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AppNavigator />
    </BrowserRouter>
  );
}

export default App;

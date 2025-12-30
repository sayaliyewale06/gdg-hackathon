import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginSelection from './LoginSelection';
import WorkerDashboard from './WorkerDashboard';
import HirerDashboard from './HirerDashboard';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginSelection />} />
          <Route path="/worker-dashboard" element={<WorkerDashboard />} />
          <Route path="/hire-dashboard" element={<HirerDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

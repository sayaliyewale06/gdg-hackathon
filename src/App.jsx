import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginSelection from './LoginSelection';
import WorkerDashboard from './WorkerDashboard';
import HirerDashboard from './HirerDashboard';
import JobApplication from './JobApplication';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<LoginSelection />} />
          <Route path="/worker-dashboard" element={<WorkerDashboard />} />
          <Route path="/my-jobs" element={<Navigate to="/worker-dashboard" state={{ view: 'myjobs' }} replace />} />
          <Route path="/hire-dashboard/*" element={<HirerDashboard />} />
          <Route path="/apply-job/:jobId" element={<JobApplication />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

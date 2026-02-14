import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import EmployeeList from './components/EmployeeList';
import AttendanceManager from './components/AttendanceManager';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<EmployeeList />} />
          <Route path="/attendance" element={<AttendanceManager />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

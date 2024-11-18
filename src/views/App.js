import './App.css';
import Dashboard from './Dashboard/Dashboard';
import Menu from './Pages/Menu';
import StudentsList from './Pages/DanhSachHocSinh/DanhSachHocSinh';
import ReceiveStudents from './Pages/TiepNhanHocSinh/TiepNhanHocSinh';
import ManageClasses from './Pages/QuanLyLopHoc/QuanLyLopHoc';
import CreateClassList from './Pages/DanhSachLop/DanhSachLop';
import ManageSubjects from './Pages/QuanLyMonHoc/QuanLyMonHoc';
import SubjectGrades from './Pages/BangDiemMonHoc/BangDiemMonHoc';
import Reports from './Pages/BaoCao/BaoCao';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <div className="app-container">
            <div className="sidebar">
              <Dashboard />
            </div>
            <div className="content">
              <Routes>
                <Route path="/home" element={<Menu />} />
                <Route path="/students-list" element={<StudentsList />} />
                <Route path="/receive-students" element={<ReceiveStudents />} />
                <Route path="/manage-classes" element={<ManageClasses />} />
                <Route path="/create-class-list" element={<CreateClassList />} />
                <Route path="/manage-subjects" element={<ManageSubjects />} />
                <Route path="/subject-grades" element={<SubjectGrades />} />
                <Route path="/reports" element={<Reports />} />
              </Routes>
            </div>
          </div>
        </Router>
      </header>
    </div>
  );
}

export default App;

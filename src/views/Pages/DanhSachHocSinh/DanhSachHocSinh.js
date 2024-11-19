import React, { useState, useEffect } from 'react';
import './DanhSachHocSinh.css';

const DanhSachHocSinh = () => {
    // State  danh sách học sinh
    const [students, setStudents] = useState([]);

    useEffect(() => {
        // Dữ liệu tạm thời
        const mockData = [
            { id: 1, name: 'Nguyễn Văn A', class: '10A1', dtbHK1: 8.5, dtbHK2: 9.0 },
            { id: 2, name: 'Nguyễn Văn B', class: '10A2', dtbHK1: 7.0, dtbHK2: 7.5 },
            { id: 3, name: 'Nguyễn Văn C', class: '10A3', dtbHK1: 6.5, dtbHK2: 8.0 },
        ];
        setStudents(mockData); // update vào state
    }, []);
    
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
    };
    
    return (
        <div>
            <h1>Danh sách học sinh</h1>
            <div className="select-group">
            <label htmlFor="year-select" className="select-label">Niên khóa</label>
              <div className="custom-select">
              <select id="year-select" name="year" className="styled-select">
                 <option value="2022-2023">2022-2023</option>
                 <option value="2023-2024">2023-2024</option>
                 <option value="2024-2025">2024-2025</option>
              </select>
              <span className="dropdown-icon"><i className="bx bx-chevron-down"></i></span>
              </div>
        </div>

            <div className="card">
                 {/* Ô tìm kiếm */}
      <div className="search-bar">
        <input 
            type="text" 
            className="search-input" 
            placeholder="Tìm kiếm học sinh..." 
            onChange={handleSearch} 
        />
    </div>
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Họ và tên</th>
                            <th>Lớp</th>
                            <th>Điểm TB học kì I</th>
                            <th>Điểm TB học kì II</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length > 0 ? (
                            students.map((student, index) => (
                                <tr key={student.id}>
                                    <td>{index + 1}</td>
                                    <td>{student.name}</td>
                                    <td>{student.class}</td>
                                    <td>{student.dtbHK1}</td>
                                    <td>{student.dtbHK2}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">Không có dữ liệu</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DanhSachHocSinh;

import React, { useState, useEffect } from 'react';
import './DanhSachHocSinh.css';

const DanhSachHocSinh = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/students');
                const data = await response.json();
                setStudents(data);
            } catch (error) {
                console.error('Error fetching students:', error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const filteredStudents = students.filter((student) =>
        student.TenHocSinh.toLowerCase().includes(searchQuery)
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading data. Please try again later.</p>;

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
                {/* Search Bar */}
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
                            <th>Ngày sinh</th>
                            <th>Địa chỉ</th>
                            <th>Email</th>
                            <th>Lớp</th>
                            <th>Khối</th>
                            <th>Sĩ số</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student, index) => (
                                <tr key={student.MaHocSinh}>
                                    <td>{index + 1}</td>
                                    <td>{student.TenHocSinh}</td>
                                    <td>{student.NgaySinh}</td>
                                    <td>{student.DiaChi}</td>
                                    <td>{student.Email}</td>
                                    <td>{student.TenLop}</td>
                                    <td>{student.TenKhoi}</td>
                                    <td>{student.SiSo}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">Không có dữ liệu</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DanhSachHocSinh;

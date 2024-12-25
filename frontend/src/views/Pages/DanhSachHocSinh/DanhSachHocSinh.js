import React, { useState, useEffect } from 'react';
import './DanhSachHocSinh.css';

const DanhSachHocSinh = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);

    const formatDate = (dateString) => {
        if (!dateString) {
            return 'N/A'; // Default for missing dates
        }
        const date = new Date(dateString);
        if (isNaN(date)) {
            return 'Invalid Date'; // Handle invalid date format
        }
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Intl.DateTimeFormat('en-GB', options).format(date);
    };        

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                let url = 'http://localhost:5000/api/students';
                if (selectedYear) {
                    url = `http://localhost:5000/api/students/year/${selectedYear}`;
                }
        
                console.log('Fetching from URL:', url);
                const response = await fetch(url);
                
                if (!response.ok) {
                    if (response.status === 404) {
                        setStudents([]);
                        setFilteredStudents([]);
                        setError(`Không tìm thấy học sinh trong niên khóa ${selectedYear}`);
                        return;
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
        
                const data = await response.json();
                console.log('Received data:', data);
        
                if (Array.isArray(data)) {
                    setStudents(data);
                    setFilteredStudents(data);
                    setError(null);
                } else {
                    throw new Error('Invalid data format received');
                }
            } catch (error) {
                console.error('Error fetching students:', error);
                setError(error.message || 'Failed to load students');
            } finally {
                setLoading(false);
            }
        };
    
        fetchStudents();
    }, [selectedYear]);

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = students.filter((student) =>
            student.TenHocSinh.toLowerCase().includes(query)
        );
        setFilteredStudents(filtered);
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Danh sách học sinh</h1>
            <div className="select-group">
                <label htmlFor="year-select" className="select-label">Niên khóa</label>
                <div className="custom-select">
                    <select
                        id="year-select"
                        name="year"
                        className="styled-select"
                        value={selectedYear}
                        onChange={handleYearChange}
                    >
                        <option value="">Tất cả</option>
                        <option value="2022-2023">2022-2023</option>
                        <option value="2023-2024">2023-2024</option>
                        <option value="2024-2025">2024-2025</option>
                    </select>
                    <span className="dropdown-icon"><i className="bx bx-chevron-down"></i></span>
                </div>
            </div>

            <div className="card">
                <div className="search-bar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Tìm kiếm học sinh..."
                        value={searchQuery}
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
                                    <td>{formatDate(student.NgaySinh)}</td>
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
                {error && (
                    <div className="error-message" style={{
                        color: '#dc2626',
                        textAlign: 'center',
                        padding: '1rem',
                        marginTop: '1rem'
                    }}>
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DanhSachHocSinh;
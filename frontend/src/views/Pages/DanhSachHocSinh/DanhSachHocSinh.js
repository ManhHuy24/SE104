import React, { useState, useEffect } from 'react';
import './DanhSachHocSinh.css';

const DanhSachHocSinh = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [years, setYears] = useState([]);

    const formatDate = (dateString) => {
        if (!dateString) {
            return 'Không xác định';
        }
        const date = new Date(dateString);
        if (isNaN(date)) {
            return 'Ngày không hợp lệ';
        }
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Intl.DateTimeFormat('vi-VN', options).format(date);
    };

    useEffect(() => {
        const fetchYears = async () => {
            try {
                const response = await fetch('http://localhost:5005/api/years');
                if (!response.ok) {
                    throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    setYears(data);
                } else {
                    throw new Error('Dữ liệu năm học không hợp lệ');
                }
            } catch (error) {
                console.error('Lỗi tải dữ liệu năm học:', error);
                setError('Không thể tải danh sách niên khóa');
            }
        };

        fetchYears();
    }, []);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                let url = 'http://localhost:5005/api/students';
                if (selectedYear) {
                    url = `http://localhost:5005/api/students/year/${selectedYear}`;
                }

                const response = await fetch(url);
                if (!response.ok) {
                    if (response.status === 404) {
                        setStudents([]);
                        setFilteredStudents([]);
                        setError(`Không tìm thấy học sinh trong niên khóa ${selectedYear}`);
                        return;
                    }
                    throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
                }

                const data = await response.json();
                if (Array.isArray(data)) {
                    setStudents(data);
                    setFilteredStudents(data);
                    setError(null);
                } else {
                    throw new Error('Dữ liệu học sinh không hợp lệ');
                }
            } catch (error) {
                console.error('Lỗi tải dữ liệu học sinh:', error);
                setError(error.message || 'Không thể tải danh sách học sinh');
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

    if (loading) return <div>Đang tải dữ liệu...</div>;

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
                        {years.map((year) => (
                            <option key={year.MaNamHoc} value={`${year.Nam1}-${year.Nam2}`}>
                                {`${year.Nam1}-${year.Nam2}`}
                            </option>
                        ))}
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
                                <td colSpan="8">Không tìm thấy học sinh phù hợp</td>
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
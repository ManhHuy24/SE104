import React, { useState, useEffect } from 'react';
import './DanhSachLop.css';

const DanhSachLop = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [years, setYears] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedClass, setSelectedClass] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const studentsResponse = await fetch('http://localhost:5000/api/students');
            const studentsData = await studentsResponse.json();
            setStudents(studentsData);
            setFilteredStudents(studentsData);

            const yearsResponse = await fetch('http://localhost:5000/api/years');
            const yearsData = await yearsResponse.json();
            setYears(yearsData);

            const classesResponse = await fetch('http://localhost:5000/classes');
            const classesData = await classesResponse.json();
            setClasses(classesData);

            // Default year and class
            setSelectedYear(`${yearsData[0].Nam1}-${yearsData[0].Nam2}`);
            setSelectedClass(classesData[0].TenLop);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = students.filter((student) =>
            student.TenHocSinh.toLowerCase().includes(query)
        );
        setFilteredStudents(filtered);
    };

    const handleCheckboxChange = (event, studentId) => {
        if (event.target.checked) {
            setSelectedStudents((prev) => [...prev, studentId]);
        } else {
            setSelectedStudents((prev) => prev.filter((id) => id !== studentId));
        }
    };

    const handleSubmit = async () => {
        if (selectedStudents.length === 0) {
            alert('Vui lòng chọn ít nhất một học sinh.');
            return;
        }

        // Find mappings
        const yearMapping = years.find((y) => `${y.Nam1}-${y.Nam2}` === selectedYear);
        const classMapping = classes.find((c) => c.TenLop === selectedClass);

        if (!yearMapping || !classMapping) {
            alert('Không thể tìm thấy thông tin năm học hoặc lớp học.');
            return;
        }

        const payload = {
            MaNamHoc: yearMapping.MaNamHoc,
            MaLop: classMapping.MaLop,
            students: selectedStudents.map((id) => ({ MaHocSinh: id })),
        };

        try {
            const response = await fetch('http://localhost:5000/api/class/add-students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            alert('Học sinh đã được thêm vào lớp thành công!');
            setSelectedStudents([]); // Reset selection after successful submission
        } catch (error) {
            console.error('Error submitting data:', error);
            alert('Có lỗi xảy ra khi thêm học sinh vào lớp.');
        }
    };

    return (
        <div>
            <h1>Lập danh sách lớp</h1>
            <div className="form-group">
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="styled-select"
                >
                    {years.map((year) => (
                        <option key={year.MaNamHoc} value={`${year.Nam1}-${year.Nam2}`}>
                            {`${year.Nam1}-${year.Nam2}`}
                        </option>
                    ))}
                </select>
                <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="styled-select"
                >
                    {classes.map((cls) => (
                        <option key={cls.MaLop} value={cls.TenLop}>
                            {cls.TenLop}
                        </option>
                    ))}
                </select>
            </div>

            <div className="table-responsive">
                <div className="search-bar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Tìm kiếm..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th className="text-center"></th>
                            <th className="text-center">STT</th>
                            <th className="text-center">Họ và tên</th>
                            <th className="text-center">Giới tính</th>
                            <th className="text-center">Năm sinh</th>
                            <th className="text-center">Địa chỉ</th>
                            <th className="text-center">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student, index) => (
                            <tr key={student.MaHocSinh}>
                                <td className="text-center">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => handleCheckboxChange(e, student.MaHocSinh)}
                                    />
                                </td>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">{student.TenHocSinh}</td>
                                <td className="text-center">{student.GioiTinh}</td>
                                <td className="text-center">{student.NgaySinh}</td>
                                <td className="text-center">{student.DiaChi}</td>
                                <td className="text-center">{student.Email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button className="btn btn-primary" onClick={handleSubmit}>
                Cập nhật danh sách lớp
            </button>
        </div>
    );
};

export default DanhSachLop;

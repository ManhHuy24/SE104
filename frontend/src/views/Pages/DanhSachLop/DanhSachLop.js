import React, { useState, useEffect } from 'react';
import './DanhSachLop.css'

const DanhSachLop = () => {
    const [showAddStudentModel, setShowAddStudentModel] = useState(false);
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [thamso, setThamso] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedYear, setSelectedYear] = useState('2022-2023'); // Default year
    const [selectedClass, setSelectedClass] = useState('10A1'); // Default class
    const [classes, setClasses] = useState([]);
    const [years, setYears] = useState([]);

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString));
    };

    const fetchStudents = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/students');
            const data = await response.json();
            setStudents(data);
            setFilteredStudents(data);

            // Fetch thamso
            const thamsoResponse = await fetch('http://localhost:5000/api/thamso');
            if (!thamsoResponse.ok) {
                throw new Error(`HTTP error! status: ${thamsoResponse.status}`);
            }
            const thamsoData = await thamsoResponse.json();
            setThamso(thamsoData);

            // Fetch classes
            const classesResponse = await fetch('http://localhost:5000/classes');
            const classesData = await classesResponse.json();
            setClasses(classesData);

            const yearsResponse = await fetch('http://localhost:5000/api/years');
            const yearsData = await yearsResponse.json();
            setYears(yearsData);
        } catch (error) {
            console.error('Error fetching students:', error);
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

    useEffect(() => {
        fetchStudents();
    }, []);

    const closeAddStudentModel = () => {
        setShowAddStudentModel(false);
    };

    const deleteStudent = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        try {
            const response = await fetch(`http://localhost:5000/api/students/${id}`, { method: 'DELETE' });
            if (response.ok) {
                const updatedStudents = students.filter(student => student.MaHocSinh !== id);
                setStudents(updatedStudents);
                setFilteredStudents(updatedStudents);
                fetchStudents();
            }
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    // Update the calculateAge function to be more precise
    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        
        // Calculate age
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        // Adjust age if birthday hasn't occurred this year
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    };

    // Handle checkbox toggle
    const handleCheckboxChange = (event, studentId) => {
        if (event.target.checked) {
            setSelectedStudents((prev) => [...prev, studentId]);
        } else {
            setSelectedStudents((prev) => prev.filter((id) => id !== studentId));
        }
    };

    const handleUpdateClass = async () => {
        if (selectedStudents.length === 0) {
            alert('Vui lòng chọn ít nhất một học sinh.');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:5000/api/class/add-students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentIds: selectedStudents,
                    classId: selectedClass,
                    year: selectedYear,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to add students to the class.');
            }
    
            alert('Học sinh đã được thêm vào lớp thành công!');
            // Optionally refresh class/student list here.
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi thêm học sinh vào lớp.');
        }
    };
    
    

    return (
        <div>
            <h1>Lập danh sách lớp</h1>
            <form onSubmit={(e) => {
                handleUpdateClass();
            }}>
                <div className="select-group-horizontal compact-layout">
                    <select name="year" value={selectedYear} className="styled-select small-select">
                        {/* <option value="2022-2023">2022-2023</option>
                        <option value="2023-2024">2023-2024</option>
                        <option value="2024-2025">2024-2025</option> */}
                        {years.map((year) => (
                            <option key={year.MaNamHoc} value={`${year.Nam1}-${year.Nam2}`}>
                                {`${year.Nam1}-${year.Nam2}`}
                            </option>
                        ))}
                    </select>
                    <select name="classes" value={selectedClass} className="styled-select small-select">
                        {/* <option value="10A1">10A1</option>
                        <option value="10A2">10A2</option>
                        <option value="10A3">10A3</option> */}

                        {classes.map((cls) => (
                            <option key={cls.MaLop} value={cls.TenLop}>
                                {cls.TenLop}
                            </option>
                        ))}
                    </select>
                    <input type="text" name="number" value="40" readOnly className="styled-input read-only-input" />
                </div>
            </form>

            <div className="button-group">
                <button className="btn btn-primary" onClick={() => setShowAddStudentModel(true)}>
                    <i className="bx bx-plus"></i> Thêm học sinh vào danh sách
                </button>
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
                            <th className="text-center">STT</th>
                            <th className="text-center">Họ và tên</th>
                            <th className="text-center">Giới tính</th>
                            <th className="text-center">Năm sinh</th>
                            <th className="text-center">Địa chỉ</th>
                            <th className="text-center">Email</th>
                            <th className="text-center">Xoá</th>
                        </tr>
                    </thead>
                    <tbody>

                        {filteredStudents.map((student, index) => (
                            <tr key={student.MaHocSinh}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">{student.TenHocSinh}</td>
                                <td className="text-center">{student.GioiTinh}</td>
                                <td className="text-center">{formatDate(student.NgaySinh)}</td>
                                <td className="text-center">{student.DiaChi}</td>
                                <td className="text-center">{student.Email}</td>
                                <td className="text-center">
                                    <button className="btn btn-delete" onClick={() => deleteStudent(student.MaHocSinh)}>
                                        <i className="bx bx-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {
                showAddStudentModel && (
                    <div className="modal-add-student">
                        <div className="modal-content-add-student">
                            <span className="close-add-student" onClick={closeAddStudentModel}>&times;</span>
                            <h2 className="title-add-student">Thêm học sinh vào danh sách</h2>
                            <div className="search-bar-add-student">
                                <input
                                    type="text"
                                    className="search-input-add-student"
                                    placeholder="Tìm kiếm học sinh..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                            </div>
                            <form onSubmit={handleUpdateClass}>
                                <table className="table-add-student">
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
                                                        // checked={selectedStudents.includes(student)}
                                                        onChange={(e) => handleCheckboxChange(e, student.MaHocSinh)}
                                                    />
                                                </td>
                                                <td className="text-center">{index + 1}</td>
                                                <td className="text-center">{student.TenHocSinh}</td>
                                                <td className="text-center">{student.GioiTinh}</td>
                                                <td className="text-center">{formatDate(student.NgaySinh)}</td>
                                                <td className="text-center">{student.DiaChi}</td>
                                                <td className="text-center">{student.Email}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button type="submit" className="save-btn-add-student">Cập nhật</button>
                            </form>
                        </div>
                    </div>
                )
            }

        </div>
    );
};

export default DanhSachLop;
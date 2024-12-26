import React, { useState, useEffect } from 'react';
import './DanhSachLop.css'

const DanhSachLop = () => {
    const [showAddStudentModel, setShowAddStudentModel] = useState(false);
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchStudents = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/students');
            const data = await response.json();
            setStudents(data);
            setFilteredStudents(data);
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

    // useEffect(() => {
    //     setFilteredStudents(students); // Sync filtered list with students
    // }, [students]);
    
    const handleAddStudent = () => {
        setShowAddStudentModel(true);
    };

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
    

    return (
        <div>
            <h1>Lập danh sách lớp</h1>
            <div className="select-group-horizontal compact-layout">
                <select name="year" className="styled-select small-select">
                    <option value="2022-2023">2022-2023</option>
                    <option value="2023-2024">2023-2024</option>
                    <option value="2024-2025">2024-2025</option>
                </select>
                <select name="classes" className="styled-select small-select">
                    <option value="10A1">10A1</option>
                    <option value="10A2">10A2</option>
                    <option value="10A3">10A3</option>
                </select>
                <input type="text" name="number" value="40" readOnly className="styled-input read-only-input" />
            </div>

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
                                <td className="text-center">{student.NgaySinh}</td>
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
                                        <tr key={student.id}>
                                            <td className="text-center">
                                                <input type="checkbox" />
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
                            <button type="submit" className="save-btn-add-student">Cập nhật</button>
                        </div>
                    </div>
                )
            }

        </div>
    );
};

export default DanhSachLop;
import React, { useState, useEffect } from 'react';
import './TiepNhanHocSinh.css';

const TiepNhanHocSinh = () => {
    const [showModel, setShowModel] = useState(false);
    const [showAddStudentModel, setShowAddStudentModel] = useState(false);
    const [showEditStudentModel, setShowEditStudentModel] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString));
    };    

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/students');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setStudents(data);
                setFilteredStudents(data);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        fetchStudents();
    }, []);

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = students.filter((student) =>
            student.TenHocSinh.toLowerCase().includes(query)
        );
        setFilteredStudents(filtered);
    };

    const handleAddStudent = () => {
        setShowAddStudentModel(true);
    };

    const closeAddStudentModel = () => {
        setShowAddStudentModel(false);
    };

    const handleAddStudentSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const newStudent = {
            TenHocSinh: formData.get('name'),
            NgaySinh: formData.get('dob'),
            GioiTinh: formData.get('gender'),
            DiaChi: formData.get('address'),
            Email: formData.get('email'),
        };
    
        try {
            const response = await fetch('http://localhost:5000/api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newStudent),
            });
    
            if (!response.ok) {
                throw new Error('Failed to add student');
            }
    
            // Fetch the updated list of students
            const updatedResponse = await fetch('http://localhost:5000/api/students');
            if (!updatedResponse.ok) {
                throw new Error('Failed to fetch updated students');
            }
    
            const updatedStudents = await updatedResponse.json();
    
            setStudents(updatedStudents);
            setFilteredStudents(
                updatedStudents.filter((student) =>
                    student.TenHocSinh.toLowerCase().includes(searchQuery)
                )
            );
            closeAddStudentModel();
        } catch (error) {
            console.error('Error adding student:', error);
            alert('Failed to add student');
        }
    };    
    
    const closeEditStudentModel = () => {
        setShowEditStudentModel(false);
    };

    const openEditStudentModel = (student) => {
        setEditingStudent(student);
        setShowEditStudentModel(true);
    };    
    
    const handleEditStudentSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const updatedStudent = {
            TenHocSinh: formData.get('name') || editingStudent.TenHocSinh,
            NgaySinh: formData.get('dob') || editingStudent.NgaySinh,
            GioiTinh: formData.get('gender') || editingStudent.GioiTinh,
            DiaChi: formData.get('address') || editingStudent.DiaChi,
            Email: formData.get('email') || editingStudent.Email,
        };
    
        try {
            const response = await fetch(`http://localhost:5000/api/students/${editingStudent.MaHocSinh}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedStudent),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update student');
            }
    
            alert('Cập nhật thành công!');
            window.location.reload(); // Reload page on success
        } catch (error) {
            console.error(error);
            alert('Không thể cập nhật học sinh');
        }
    };    

    const handleDeleteStudent = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/students/${id}`, {
                    method: 'DELETE',
                });
    
                if (!response.ok) {
                    throw new Error('Failed to delete student');
                }
    
                // Refetch the updated list of students from the backend
                const updatedResponse = await fetch('http://localhost:5000/api/students');
                if (!updatedResponse.ok) {
                    throw new Error(`HTTP error! status: ${updatedResponse.status}`);
                }
                const updatedStudents = await updatedResponse.json();
    
                setStudents(updatedStudents);
                setFilteredStudents(
                    updatedStudents.filter((student) =>
                        student.TenHocSinh.toLowerCase().includes(searchQuery)
                    )
                );
            } catch (error) {
                console.error(error);
                alert('Failed to delete student');
            }
        }
    };    
    

    const handleImportFile = () => {
        setShowModel(true);
    };

    const closeModel = () => {
        setShowModel(false);
    };

    return (
        <div className="container">
            <h1 className="h1.tiepnhan">Tiếp nhận học sinh</h1>
            <div className="button-group">
                <button className="btn btn-primary" onClick={handleAddStudent}>
                    <i className="bx bx-plus"></i> Thêm học sinh mới
                </button>
                <button className="btn btn-primary" onClick={handleImportFile}>
                    <i className="bx bx-import"></i> Nhập file
                </button>
            </div>

            <div className="table-responsive">
                <div className="search-bar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Tìm kiếm học sinh..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th className="text-center">Mã học sinh</th>
                            <th className="text-center">Họ và tên</th>
                            <th className="text-center">Ngày sinh</th>
                            <th className="text-center">Giới tính</th>
                            <th className="text-center">Địa chỉ</th>
                            <th className="text-center">Email</th>
                            <th className="text-center">Chỉnh sửa</th>
                            <th className="text-center">Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <tr key={student.MaHocSinh}>
                                    <td className="text-center">{student.MaHocSinh}</td>
                                    <td className="text-center">{student.TenHocSinh}</td>
                                    <td className="text-center">{formatDate(student.NgaySinh)}</td>
                                    <td className="text-center">{student.GioiTinh}</td>
                                    <td className="text-center">{student.DiaChi}</td>
                                    <td className="text-center">{student.Email}</td>
                                    <td className="text-center">
                                        <button className="btn btn-edit" onClick={() => openEditStudentModel(student)}>
                                            <i className="bx bxs-edit"></i>
                                        </button>
                                    </td>
                                    <td className="text-center">
                                        <button className="btn btn-delete" onClick={() => handleDeleteStudent(student.MaHocSinh)}>
                                            <i className="bx bx-trash"></i>
                                        </button>
                                    </td>
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

            {showAddStudentModel && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeAddStudentModel}>&times;</span>
                        <h2>Thêm học sinh mới</h2>
                        <form onSubmit={handleAddStudentSubmit}>
                            <div className="form-group">
                                <label>Họ và tên:</label>
                                <input type="text" name="name" placeholder="Nhập họ và tên" />
                            </div>
                            <div className="form-group">
                                <label>Ngày sinh:</label>
                                <input type="date" name="dob" />
                            </div>
                            <div className="form-group">
                                <label>Giới tính:</label>
                                <select name="gender">
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Địa chỉ:</label>
                                <input type="text" name="address" placeholder="Nhập địa chỉ" />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input type="email" name="email" placeholder="Nhập email" />
                            </div>
                            <button type="submit" className="save-btn">Thêm</button>
                        </form>
                    </div>
                </div>
            )}

            {showEditStudentModel && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeEditStudentModel}>&times;</span>
                        <h2>Chỉnh sửa học sinh</h2>
                        <form onSubmit={handleEditStudentSubmit}>
                            <div className="form-group">
                                <label>Họ và tên:</label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={editingStudent?.TenHocSinh || ''}
                                    placeholder="Nhập họ và tên"
                                />
                            </div>
                            <div className="form-group">
                                <label>Ngày sinh:</label>
                                <input
                                    type="date"
                                    name="dob"
                                    defaultValue={
                                        editingStudent?.NgaySinh
                                            ? new Date(editingStudent.NgaySinh).toISOString().split('T')[0]
                                            : ''
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>Giới tính:</label>
                                <select name="gender" defaultValue={editingStudent?.GioiTinh || ''}>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Địa chỉ:</label>
                                <input
                                    type="text"
                                    name="address"
                                    defaultValue={editingStudent?.DiaChi || ''}
                                    placeholder="Nhập địa chỉ"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={editingStudent?.Email || ''}
                                    placeholder="Nhập email"
                                />
                            </div>
                            <button type="submit" className="save-btn">Cập nhật</button>
                        </form>
                    </div>
                </div>
            )}

            {showModel && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModel}>&times;</span>
                        <form method="POST" encType="multipart/form-data">
                            <input type="file" name="file" />
                            <button type="submit">Nhập dữ liệu</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TiepNhanHocSinh;
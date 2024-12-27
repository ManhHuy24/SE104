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
    const [thamso, setThamso] = useState(null);

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString));
    };    

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch students
                const studentsResponse = await fetch('http://localhost:5005/api/students');
                if (!studentsResponse.ok) {
                    throw new Error(`HTTP error! status: ${studentsResponse.status}`);
                }
                const studentsData = await studentsResponse.json();
                setStudents(studentsData);
                setFilteredStudents(studentsData);

                // Fetch thamso
                const thamsoResponse = await fetch('http://localhost:5005/api/thamso');
                if (!thamsoResponse.ok) {
                    throw new Error(`HTTP error! status: ${thamsoResponse.status}`);
                }
                const thamsoData = await thamsoResponse.json();
                setThamso(thamsoData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

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

    // Update the validateAge function to add more logging
    const validateAge = (birthDate) => {
        if (!thamso) {
            console.log('ThamSo not loaded yet');
            return { isValid: false, message: 'Không thể kiểm tra tuổi, vui lòng thử lại' };
        }
        
        const age = calculateAge(birthDate);
        console.log('Calculated age:', age);
        console.log('Min age allowed:', thamso.TuoiHocSinhToiThieu);
        console.log('Max age allowed:', thamso.TuoiHocSinhToiDa);
        
        if (age < thamso.TuoiHocSinhToiThieu) {
            return {
                isValid: false,
                message: `Tuổi học sinh không được nhỏ hơn ${thamso.TuoiHocSinhToiThieu} tuổi (hiện tại: ${age} tuổi)`
            };
        }
        
        if (age > thamso.TuoiHocSinhToiDa) {
            return {
                isValid: false,
                message: `Tuổi học sinh không được lớn hơn ${thamso.TuoiHocSinhToiDa} tuổi (hiện tại: ${age} tuổi)`
            };
        }
        
        return { isValid: true };
    };

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
        const birthDate = formData.get('dob');
        // Add validation
        const ageValidation = validateAge(birthDate);
        if (!ageValidation.isValid) {
            alert(ageValidation.message);
            return; // This line is crucial - it stops the function if validation fails
        }

        const newStudent = {
            TenHocSinh: formData.get('name'),
            NgaySinh: birthDate,
            GioiTinh: formData.get('gender'),
            DiaChi: formData.get('address'),
            Email: formData.get('email'),
        };
    
        try {
            const response = await fetch('http://localhost:5005/api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newStudent),
            });
    
            if (!response.ok) {
                throw new Error('Không thể thêm học sinh');
            }
    
            const updatedResponse = await fetch('http://localhost:5005/api/students');
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
            alert('Không thể thêm học sinh');
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
        const birthDate = formData.get('dob') || editingStudent.NgaySinh;
        
        // Add validation
        const ageValidation = validateAge(birthDate);
        if (!ageValidation.isValid) {
            alert(ageValidation.message);
            return; // This line is crucial - it stops the function if validation fails
        }

        const updatedStudent = {
            TenHocSinh: formData.get('name') || editingStudent.TenHocSinh,
            NgaySinh: birthDate,
            GioiTinh: formData.get('gender') || editingStudent.GioiTinh,
            DiaChi: formData.get('address') || editingStudent.DiaChi,
            Email: formData.get('email') || editingStudent.Email,
        };
    
        try {
            const response = await fetch(`http://localhost:5005/api/students/${editingStudent.MaHocSinh}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedStudent),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update student');
            }
    
            const updatedResponse = await fetch('http://localhost:5005/api/students');
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
    
            alert('Cập nhật thành công!');
            closeEditStudentModel();
        } catch (error) {
            console.error(error);
            alert('Không thể cập nhật học sinh');
        }
    };

    const handleDeleteStudent = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa học sinh này không?')) {
            try {
                const response = await fetch(`http://localhost:5005/api/students/${id}`, {
                    method: 'DELETE',
                });
    
                if (!response.ok) {
                    throw new Error('Không thể xóa học sinh');
                }
    
                // Refetch the updated list of students from the backend
                const updatedResponse = await fetch('http://localhost:5005/api/students');
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
                alert('Không thể xóa học sinh');
            }
        }
    };    
    

    const handleImportFile = () => {
        setShowModel(true);
    };

    const handleImportFileSubmit = async (event) => {
        event.preventDefault();
        const file = event.target.file.files[0];
    
        if (!file) {
            alert('Vui lòng chọn một tệp.');
            return;
        }
    
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            const response = await fetch('http://localhost:5005/api/import', {
                method: 'POST',
                body: formData,
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                if (data.errors && data.errors.length > 0) {
                    alert('Một số học sinh không thể nhập vào được.');
                } else {
                    throw new Error(data.message || 'Failed to import file');
                }
            }
    
            const updatedResponse = await fetch('http://localhost:5005/api/students');
            if (!updatedResponse.ok) {
                throw new Error('Failed to fetch updated students');
            }
            const updatedStudents = await updatedResponse.json();
            setStudents(updatedStudents);
            setFilteredStudents(updatedStudents);
    
            closeModel();
            alert('Tệp đã được xử lý thành công!');
        } catch (error) {
            console.error('Error importing file:', error);
            alert('Không thể xử lý tệp.');
        }
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
                                <td colSpan="8">Không tìm thấy học sinh phù hợp</td>
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
                        <form method="POST" encType="multipart/form-data" onSubmit={handleImportFileSubmit}>
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
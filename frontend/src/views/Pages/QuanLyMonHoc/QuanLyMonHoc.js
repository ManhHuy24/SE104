import React, { useState, useEffect } from 'react';
import './QuanLyMonHoc.css';

const QuanLyMonHoc = () => {
    const [subjects, setSubjects] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [showAddSubjectModel, setShowAddSubjectModel] = useState(false);
    const [showEditSubjectModel, setShowEditSubjectModel] = useState(false);
    const [currentSubject, setCurrentSubject] = useState(null);
    const [newSubject, setNewSubject] = useState({ TenMonHoc: '', DiemDatMonHoc: '' });
    const [editSubject, setEditSubject] = useState({ MaMonHoc: '', TenMonHoc: '', DiemDatMonHoc: '' });

    // Fetch all subjects on mount
    useEffect(() => {
        fetchSubjects();
    }, []);

    // Fetch subjects from API
    const fetchSubjects = async () => {
        try {
            const response = await fetch('http://localhost:5005/api/subjects');
            if (response.ok) {
                const data = await response.json();
                setSubjects(data);
            } else {
                console.error('Error fetching subjects:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    // Handle add subject
    const handleAddSubject = () => {
        setShowAddSubjectModel(true);
    };

    // Close Add Subject Modal
    const closeAddSubjectModel = () => {
        setShowAddSubjectModel(false);
        setNewSubject({ TenMonHoc: '', DiemDatMonHoc: '' });
    };

    // Handle edit subject
    const handleEditSubject = (subject) => {
        setEditSubject(subject);
        setShowEditSubjectModel(true);
    };

    // Close Edit Subject Modal
    const closeEditSubjectModel = () => {
        setShowEditSubjectModel(false);
        setEditSubject({ MaMonHoc: '', TenMonHoc: '', DiemDatMonHoc: '' });
    };

    // Handle input change for Add Subject form
    const handleAddInputChange = (e) => {
        const { name, value } = e.target;
        setNewSubject({ ...newSubject, [name]: value });
    };

    // Handle input change for Edit Subject form
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditSubject({ ...editSubject, [name]: value });
    };

    // Submit Add Subject form
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5005/api/subjects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSubject),
            });
            if (response.ok) {
                await fetchSubjects();
                closeAddSubjectModel();
                alert('Thêm môn học thành công!');
            } else {
                console.error('Failed to add subject');
            }
        } catch (error) {
            console.error('Error adding subject:', error);
        }
    };

    // Submit Edit Subject form
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5005/api/subjects', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editSubject),
            });
            if (response.ok) {
                await fetchSubjects();
                closeEditSubjectModel();
                alert('Cập nhật môn học thành công!');
            } else {
                console.error('Failed to update subject');
            }
        } catch (error) {
            console.error('Error updating subject:', error);
        }
    };

    // Handle delete subject
    const handleDeleteSubject = async (subjectId) => {
        try {
            const response = await fetch(`http://localhost:5005/api/subjects`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ MaMonHoc: subjectId }),
            });
            if (response.ok) {
                await fetchSubjects();
                alert('Xóa môn học thành công!');
            } else {
                console.error('Failed to delete subject');
            }
        } catch (error) {
            console.error('Error deleting subject:', error);
        }
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    // Filter subjects based on search keyword
    const filteredSubjects = subjects.filter((subject) =>
        subject.TenMonHoc.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    return (
        <div className="container">
            <h1 className="h1">Quản lý môn học</h1>
            <div className="button-group">
                <button className="btn btn-primary" onClick={handleAddSubject}>
                    <i className="bx bx-plus"></i> Thêm môn học mới
                </button>
            </div>

            <div className="table-responsive">
                <div className="search-bar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Tìm kiếm môn học..."
                        value={searchKeyword}
                        onChange={handleSearchChange}
                    />
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th className="text-center">Mã môn học</th>
                            <th className="text-center">Tên môn học</th>
                            <th className="text-center">Số điểm đạt</th>
                            <th className="text-center">Chỉnh sửa</th>
                            <th className="text-center">Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSubjects.length > 0 ? (
                            filteredSubjects.map((subject) => (
                                <tr key={subject.MaMonHoc}>
                                    <td className="text-center">{subject.MaMonHoc}</td>
                                    <td className="text-center">{subject.TenMonHoc}</td>
                                    <td className="text-center">{subject.DiemDatMonHoc}</td>
                                    <td className="text-center">
                                        <button className="btn btn-edit" onClick={() => handleEditSubject(subject)}>
                                            <i className="bx bxs-edit"></i>
                                        </button>
                                    </td>
                                    <td className="text-center">
                                        <button className="btn btn-delete" onClick={() => handleDeleteSubject(subject.MaMonHoc)}>
                                            <i className="bx bx-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">Không có môn học nào phù hợp.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Subject Modal */}
            {showAddSubjectModel && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeAddSubjectModel}>&times;</span>
                        <h2>Thêm môn học</h2>
                        <form onSubmit={handleAddSubmit}>
                            <div className="form-group">
                                <label>Tên môn học:</label>
                                <input
                                    type="text"
                                    name="TenMonHoc"
                                    value={newSubject.TenMonHoc}
                                    onChange={handleAddInputChange}
                                    placeholder="Toán"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Số điểm đạt:</label>
                                <input
                                    type="text"
                                    name="DiemDatMonHoc"
                                    value={newSubject.DiemDatMonHoc}
                                    onChange={handleAddInputChange}
                                    placeholder="5"
                                    required
                                />
                            </div>
                            <button type="submit" className="save-btn">Thêm</button>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Edit Subject Modal */}
            {showEditSubjectModel && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeEditSubjectModel}>&times;</span>
                        <h2>Chỉnh sửa môn học</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className="form-group">
                                <label>Mã môn học:</label>
                                <input
                                    type="text"
                                    name="MaMonHoc"
                                    value={editSubject.MaMonHoc}
                                    onChange={handleEditInputChange}
                                    readOnly
                                    className="styled-input read-only-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Tên môn học:</label>
                                <input
                                    type="text"
                                    name="TenMonHoc"
                                    value={editSubject.TenMonHoc}
                                    onChange={handleEditInputChange}
                                    placeholder="Toán"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Số điểm đạt:</label>
                                <input
                                    type="text"
                                    name="DiemDatMonHoc"
                                    value={editSubject.DiemDatMonHoc}
                                    onChange={handleEditInputChange}
                                    placeholder="5"
                                    required
                                />
                            </div>
                            <button type="submit" className="save-btn">Cập nhật</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuanLyMonHoc;

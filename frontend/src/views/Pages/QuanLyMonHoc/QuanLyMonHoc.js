import React, { useState } from 'react';
import './QuanLyMonHoc.css';

const QuanLyMonHoc = () => {
    const [showModel, setShowModel] = useState(false);
    const [showAddSubjectModel, setShowAddSubjectModel] = useState(false);
    const [showEditSubjectModel, setShowEditSubjectModel] = useState(false);

    const handleAddSubject = () => {
        setShowAddSubjectModel(true);
    };

    const closeAddSubjectModel = () => {
        setShowAddSubjectModel(false);
    };

    const handleImportFile = () => {
        setShowModel(true);
    };

    const closeModel = () => {
        setShowModel(false);
    };

    const handleEditSubject = () => {
        setShowEditSubjectModel(true);
    };

    const closeEditSubjectModel = () => {
        setShowEditSubjectModel(false);
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
    };

    const handleAddSubmit = (event) => {
        event.preventDefault();
        closeAddSubjectModel();
    };

    const handleEditSubmit = (event) => {
        event.preventDefault();
        closeEditSubjectModel();
    };

    return (
        <div className="container">
            <h1 className="h1.tiepnhan">Quản lý môn học</h1>
            <div className="button-group">
                <button className="btn btn-primary" onClick={handleAddSubject}>
                    <i className="bx bx-plus"></i> Thêm môn học mới
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
                        placeholder="Tìm kiếm môn học..."
                        onChange={handleSearch}
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
                        <tr>
                            <td className="text-center">1</td>
                            <td className="text-center">Toán</td>
                            <td className="text-center">5.0</td>
                            <td className="text-center">
                                <button className="btn btn-edit" onClick={handleEditSubject}>
                                    <i className="bx bxs-edit"></i>
                                </button>
                            </td>
                            <td className="text-center">
                                <button className="btn btn-delete">
                                    <i className="bx bx-trash"></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td className="text-center">2</td>
                            <td className="text-center">Văn</td>
                            <td className="text-center">5.0</td>
                            <td className="text-center">
                                <button className="btn btn-edit" onClick={handleEditSubject}>
                                    <i className="bx bxs-edit"></i>
                                </button>
                            </td>
                            <td className="text-center">
                                <button className="btn btn-delete">
                                    <i className="bx bx-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {showAddSubjectModel && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeAddSubjectModel}>&times;</span>
                        <h2>Thêm môn học</h2>
                        <form onSubmit={handleAddSubmit}>
                            <div className="form-group">
                                <label>Tên môn học:</label>
                                <input type="text" name="name" placeholder="Toán" required />
                            </div>
                            <div className="form-group">
                                <label>Số điểm đạt:</label>
                                <input type="text" name="address" placeholder="5" required />
                            </div>
                            <button type="submit" className="save-btn">Thêm</button>
                        </form>
                    </div>
                </div>
            )}

            {showEditSubjectModel && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeEditSubjectModel}>&times;</span>
                        <h2>Chỉnh sửa môn học</h2>
                        <form onSubmit={handleEditSubmit}>
                        <div className="form-group">
                                <label>Mã môn học:</label>
                                <input type="text" name="name" placeholder="1" required readOnly className="styled-input read-only-input" />
                            </div>
                        <div className="form-group">
                                <label>Tên môn học:</label>
                                <input type="text" name="name" placeholder="Toán" required />
                            </div>
                            <div className="form-group">
                                <label>Số điểm đạt:</label>
                                <input type="text" name="address" placeholder="5" required />
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
                            <input type="file" name="file" required />
                            <button type="submit" className="import-btn">Nhập dữ liệu</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuanLyMonHoc;

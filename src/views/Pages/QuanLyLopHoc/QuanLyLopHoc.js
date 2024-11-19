import React, { useState } from 'react';
import './QuanLyLopHoc.css';

const QuanLyLopHoc = () => {
    const [showAddClassModel, setShowAddClassModel] = useState(false);
    const [showEditClassModel, setShowEditClassModel] = useState(false);

    const handleAddClass = () => {
        setShowAddClassModel(true);
    };

    const closeAddClassModel = () => {
        setShowAddClassModel(false);
    };


    const handleEditClass = () => {
        setShowEditClassModel(true);
    };

    const closeEditClassModel = () => {
        setShowEditClassModel(false);
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
    };

    return (
        <div className="container">
            <h1 className="h1.tiepnhan">Quản lý lớp học</h1>
            <div className="button-group">
                <button className="btn btn-primary" onClick={handleAddClass}>
                    <i className="bx bx-plus"></i> Thêm lớp học mới
                </button>
            </div>

            <div className="table-responsive">
                {/* Ô tìm kiếm */}
                <div className="search-bar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Tìm kiếm lớp học..."
                        onChange={handleSearch}
                    />
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th className="text-center">STT</th>
                            <th className="text-center">Tên lớp học</th>
                            <th className="text-center">Khối lớp</th>
                            <th className="text-center">Chỉnh sửa</th>
                            <th className="text-center">Xoá</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-center">1</td>
                            <td className="text-center">Lớp 10A1</td>
                            <td className="text-center">Khối 10</td>
                            <td className="text-center">
                                <button className="btn btn-edit" onClick={() => handleEditClass()}>
                                    <i className="bx bxs-edit"></i>
                                </button>
                            </td>
                            <td className="text-center">
                                <button className="btn btn-delete"><i className="bx bx-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td className="text-center">2</td>
                            <td className="text-center">Lớp 10A2</td>
                            <td className="text-center">Khối 10</td>
                            <td className="text-center">
                                <button className="btn btn-edit" onClick={() => handleEditClass()}>
                                    <i className="bx bxs-edit"></i>
                                </button>
                            </td>

                            <td className="text-center">
                                <button className="btn btn-delete"><i className="bx bx-trash"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {
                showAddClassModel && (
                    <div className="modal-add-class">
                        <div className="modal-content-add-class">
                            <span className="close-add-class" onClick={closeAddClassModel}>&times;</span>
                            <h2>Thêm lớp học</h2>
                            <form className="form-add-class">
                                <div className="form-row-add-class">
                                    <label>Tên lớp học:</label>
                                    <input type="text" name="classname" placeholder="Lớp 10A1" />
                                </div>
                                <div className="form-row-add-class">
                                    <label>Tên khối:</label>
                                    <select name="grade">
                                        <option value="Khối 10">Khối 10</option>
                                        <option value="Khối 11">Khối 11</option>
                                        <option value="Khối 12">Khối 12</option>
                                    </select>
                                </div>
                                <button type="submit" className="save-btn-add-class">Thêm</button>
                            </form>
                        </div>
                    </div>
                )
            }


            {
                showEditClassModel && (
                    <div className="modal-add-class">
                        <div className="modal-content-add-class">
                            <span className="close-add-class" onClick={closeEditClassModel}>&times;</span>
                            <h2>Chỉnh sửa lớp học</h2>
                            <form className="form-add-class">
                                <div className="form-row-add-class">
                                    <label>Mã lớp học:</label>
                                    <input type="text" name="classname" placeholder="1" />
                                </div>
                                <div className="form-row-add-class">
                                    <label>Tên lớp học:</label>
                                    <input type="text" name="classname" placeholder="Lớp 10A1" />
                                </div>
                                <div className="form-row-add-class">
                                    <label>Tên khối:</label>
                                    <select name="grade">
                                        <option value="Khối 10">Khối 10</option>
                                        <option value="Khối 11">Khối 11</option>
                                        <option value="Khối 12">Khối 12</option>
                                    </select>
                                </div>
                                <button type="submit" className="save-btn-add-class">Cập nhật</button>
                            </form>
                        </div>
                    </div>
                )
            }

        </div>
    );
};

export default QuanLyLopHoc;

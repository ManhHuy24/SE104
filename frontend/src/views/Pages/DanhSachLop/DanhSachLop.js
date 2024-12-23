import React, { useState } from 'react';
import './DanhSachLop.css'

const DanhSachLop = () => {
    const [showAddStudentModel, setShowAddStudentModel] = useState(false);

    const handleAddStudent = () => {
        setShowAddStudentModel(true);
    };

    const closeAddStudentModel = () => {
        setShowAddStudentModel(false);
    };
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
    };
    const handleSearchStudent = (event) => {
        const query = event.target.value.toLowerCase();
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
                <button className="btn btn-primary" onClick={handleAddStudent}>
                    <i className="bx bx-plus"></i> Thêm học sinh vào danh sách
                </button>
            </div>
            <div className="table-responsive">
                <div className="search-bar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Tìm kiếm..."
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
                        <tr>
                            <td className="text-center">1</td>
                            <td className="text-center">Nguyễn A</td>
                            <td className="text-center">Nam</td>
                            <td className="text-center">11-11-2008</td>
                            <td className="text-center">abc</td>
                            <td className="text-center">123@gmail</td>
                            <td className="text-center">
                                <button className="btn btn-delete"><i className="bx bx-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td className="text-center">2</td>
                            <td className="text-center">Trần B</td>
                            <td className="text-center">Nữ</td>
                            <td className="text-center">02-02-2008</td>
                            <td className="text-center">def</td>
                            <td className="text-center">456@gmail</td>
                            <td className="text-center">
                                <button className="btn btn-delete"><i className="bx bx-trash"></i></button>
                            </td>
                        </tr>
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
                        onChange={handleSearchStudent}
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
                        <tr>
                            <td className="text-center">
                                <input type="checkbox" />
                            </td>
                            <td className="text-center">1</td>
                            <td className="text-center">Nguyễn A</td>
                            <td className="text-center">Nam</td>
                            <td className="text-center">11-11-2008</td>
                            <td className="text-center">abc</td>
                            <td className="text-center">123@gmail</td>
                        </tr>
                        <tr>
                            <td className="text-center">
                                <input type="checkbox" />
                            </td>
                            <td className="text-center">2</td>
                            <td className="text-center">Trần B</td>
                            <td className="text-center">Nữ</td>
                            <td className="text-center">02-02-2008</td>
                            <td className="text-center">def</td>
                            <td className="text-center">456@gmail</td>
                        </tr>
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
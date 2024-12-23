import React, { useState } from 'react';
import './TiepNhanHocSinh.css';

const TiepNhanHocSinh = () => {
    const [showModel, setShowModel] = useState(false);
    const [showAddStudentModel, setShowAddStudentModel] = useState(false);
    const [showEditStudentModel, setShowEditStudentModel] = useState(false);

    const handleAddStudent = () => {
        setShowAddStudentModel(true);
    };

    const closeAddStudentModel = () => {
        setShowAddStudentModel(false);
    };

    const handleImportFile = () => {
        setShowModel(true);
    };

    const closeModel = () => {
        setShowModel(false);
    };

    const handleEditStudent = () => {
        setShowEditStudentModel(true);
    };

    const closeEditStudentModel = () => {
        setShowEditStudentModel(false);
    };
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
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
         {/* Ô tìm kiếm */}
      <div className="search-bar">
        <input 
            type="text" 
            className="search-input" 
            placeholder="Tìm kiếm học sinh..." 
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
                        <tr>
                            <td className="text-center">001</td>
                            <td className="text-center">Nguyễn Văn A</td>
                            <td className="text-center">01/01/2010</td>
                            <td className="text-center">Nam</td>
                            <td className="text-center">HCM</td>
                            <td className="text-center">a@gmail.com</td>
                            <td className="text-center">
                                <button className="btn btn-edit" onClick={() => handleEditStudent()}>
                                    <i className="bx bxs-edit"></i>
                                </button>
                            </td>
                            <td className="text-center">
                                <button className="btn btn-delete"><i className="bx bx-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td className="text-center">002</td>
                            <td className="text-center">Nguyễn Văn B</td>
                            <td className="text-center">01/01/2010</td>
                            <td className="text-center">Nam</td>
                            <td className="text-center">HCM</td>
                            <td className="text-center">B@gmail.com</td>
                            <td className="text-center">
                                <button className="btn btn-edit" onClick={() => handleEditStudent()}>
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
                showAddStudentModel && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={closeAddStudentModel}>&times;</span>
                            <h2>Thêm học sinh mới</h2>
                            <form>
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
                )
            }

{
    showEditStudentModel && (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={closeEditStudentModel}>&times;</span>
                <h2>Chỉnh sửa học sinh</h2>
                <form>
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
                    <button type="submit" className="save-btn">Cập nhật</button>
                </form>
            </div>
        </div>
    )
}

            {
                showModel && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={closeModel}>&times;</span>
                            <form method="POST" encType="multipart/form-data">
                                <input type="file" name="file" />
                               <button type="submit">Nhập dữ liệu</button>
                            </form>
                        </div>
                    </div>
                )
            }

        </div>
    );
};

export default TiepNhanHocSinh;

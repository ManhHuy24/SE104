import React, { useState } from 'react';
import './TiepNhanHocSinh.css';

const TiepNhanHocSinh = () => {
    const [showModal, setShowModal] = useState(false);

    const handleAddStudent = () => {
        alert('backend');
    };

    const handleImportFile = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
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

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <form method="POST" encType="multipart/form-data">
                            <input type="file" name="file" />
                            <button type="submit">Nhập dữ liệu</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="text-center">Mã học sinh</th>
                            <th className="text-center">Họ và tên</th>
                            <th className="text-center">Ngày sinh</th>
                            <th className="text-center">Giới tính</th>
                            <th className="text-center">Địa chỉ</th>
                            <th className="text-center">Email</th>
                            <th className="text-center">Trạng thái</th>
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
                            <td className="text-center">Đang học</td>
                            <td className="text-center">
                                <button className="btn btn-edit"><i className="bx bxs-edit"></i></button>
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
                            <td className="text-center">Đang học</td>
                            <td className="text-center">
                                <button className="btn btn-edit"><i className="bx bxs-edit"></i></button>
                            </td>
                            <td className="text-center">
                                <button className="btn btn-delete"><i className="bx bx-trash"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TiepNhanHocSinh;

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
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={closeAddStudentModel}>&times;</span>
                            <h2>Thêm lớp học</h2>
                            <form>
                                <div>
                                    <label>Họ và tên:</label>
                                    <input type="text" name="name" placeholder="Nguyễn A" />
                                </div>
                                <div>
                                    <label>Giới tính:</label>
                                    <select name="gender">
                                        <option value="Nam">Nam</option>
                                        <option value="Nu">Nữ</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Năm sinh:</label>
                                    <input type="date" name="date" />
                                </div>
                                <div>
                                    <label>Địa chỉ:</label>
                                    <input type="text" name="address" placeholder="abc" />
                                </div>
                                <div>
                                    <label>Email:</label>
                                    <input type="text" name="email" placeholder="123@gmail" />
                                </div>
                                <button type="submit">Lưu</button>
                            </form>
                        </div>
                    </div>
                )
            }

        </div>
    );
};

export default DanhSachLop;

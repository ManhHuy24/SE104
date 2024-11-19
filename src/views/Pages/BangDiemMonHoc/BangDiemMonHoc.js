import React, { useState } from 'react';
import './BangDiemMonHoc.css';

const BangDiemMonHoc = () => {
    const [showAddScoreModel, setShowAddScoreModel] = useState(false);
    const [showEditScoreModel, setShowEditScoreModel] = useState(false);

    const handleAddScore = () => {
        setShowAddScoreModel(true);
    };

    const closeAddScoreModel = () => {
        setShowAddScoreModel(false);
    };

    const handleEditScore = () => {
        setShowEditScoreModel(true);
    };

    const closeEditScoreModel = () => {
        setShowEditScoreModel(false);
    };
    return (
    <div>
        <h1>Bảng điểm môn học</h1>
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

        <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="text-center">Mã học sinh</th>
                            <th className="text-center">Họ tên</th>
                            <th className="text-center">Kiểm tra 15 phút</th>
                            <th className="text-center">Kiểm tra 1 tiết</th>
                            <th className="text-center">Kiểm tra học kỳ</th>
                            <th className="text-center">Chỉnh sửa</th>
                            <th className="text-center">Thêm điểm</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-center">001</td>
                            <td className="text-center">Nguyễn A</td>
                            <td className="text-center">8</td>
                            <td className="text-center">10</td>
                            <td className="text-center">9</td>
                            <td className="text-center">
                                <button className="btn btn-edit" onClick={() => handleEditScore()}>
                                    <i className="bx bxs-edit"></i>
                                </button>
                            </td>
                            
                        </tr>
                        <tr>
                            <td className="text-center">002</td>
                            <td className="text-center">Trần B</td>
                            <td className="text-center">7</td>
                            <td className="text-center">6</td>
                            <td className="text-center">9</td>
                            <td className="text-center">
                                <button className="btn btn-edit" onClick={() => handleEditScore()}>
                                    <i className="bx bxs-edit"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>


       
    </div>
    );
};

export default BangDiemMonHoc;

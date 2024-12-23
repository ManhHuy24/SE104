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
        <div className="select-group-scorelist">
        <div className="select-group">
            <label htmlFor="year-select" className="select-label">Niên khóa</label>
              <div className="custom-select">
              <select id="year-select" name="year" className="styled-select">
                 <option value="2022-2023">2022-2023</option>
                 <option value="2023-2024">2023-2024</option>
                 <option value="2024-2025">2024-2025</option>
              </select>
              <span className="dropdown-icon"><i className="bx bx-chevron-down"></i></span>
              </div>
        </div>

        <div className="select-group">
            <label htmlFor="class-select" className="select-label">Lớp</label>
              <div className="custom-select">
              <select id="class-select" name="class" className="styled-select">
                 <option value="10A1">10A1</option>
                 <option value="10A2">10A2</option>
                 <option value="10A3">10A3</option>
              </select>
              <span className="dropdown-icon"><i className="bx bx-chevron-down"></i></span>
              </div>
        </div>

        <div className="select-group">
           <label htmlFor="sub-select" className="select-label">Môn học</label>
           <input type="text" name="name" placeholder="Toán" required class="input-large" />
        </div>

        <div className="select-group">
            <label htmlFor="sem-select" className="select-label">Học kỳ</label>
              <div className="custom-select">
              <select id="sem-select" name="sem" className="styled-select">
                 <option value="HK1">Học kỳ I</option>
                 <option value="HK2">Học kỳ II</option>
              </select>
              <span className="dropdown-icon"><i className="bx bx-chevron-down"></i></span>
              </div>
        </div>
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
                            <td className="text-center">
                                <button className="btn btn-primary" onClick={() => handleAddScore()}>
                                    <i className="bx bx-plus"></i>
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
                            <td className="text-center">
                                <button className="btn btn-primary" onClick={() => handleAddScore()}>
                                    <i className="bx bx-plus"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
    
            {
                showEditScoreModel && (
                    <div className="modal-add-class">
                        <div className="modal-content-add-class">
                            <span className="close-add-class" onClick={closeEditScoreModel}>&times;</span>
                            <h2>Chỉnh sửa bảng điểm môn học</h2>
                            <form className="form-add-class">
                                <div className="form-row-add-class">
                                    <label>Mã học sinh:</label>
                                    <input type="text" name="classname" placeholder="001" readOnly className="styled-input read-only-input"/>
                                </div>
                                <div className="form-row-add-class">
                                    <label>Họ và tên:</label>
                                    <input type="text" name="classname" placeholder="Nguyễn A" readOnly className="styled-input read-only-input"/>
                                </div>
                                <div className="form-row-add-class">
                                    <label>Kiểm tra 15 phút:</label>
                                    <input type="text" name="classname" placeholder="8" />
                                </div>
                                <div className="form-row-add-class">
                                    <label>Kiểm tra 1 tiết:</label>
                                    <input type="text" name="classname" placeholder="10" />
                                </div>
                                <div className="form-row-add-class">
                                    <label>Kiểm tra học kỳ:</label>
                                    <input type="text" name="classname" placeholder="9" />
                                </div>
                                <button type="submit" className="save-btn-add-class">Cập nhật</button>
                            </form>
                        </div>
                    </div>
                )
            }

            {
                showAddScoreModel && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={closeAddScoreModel}>&times;</span>
                            <h2>Thêm điểm môn học</h2>
                            <form>
                    <div className="form-group">
                        <label>Kiểm tra 15 phút:</label>
                        <input type="text" name="name" placeholder="Thêm..." />
                    </div>
                    <div className="form-group">
                        <label>Kiểm tra 1 tiết:</label>
                        <input type="text" name="name" placeholder="Thêm..." />
                    </div>
                    <div className="form-group">
                        <label>Kiểm tra học kỳ:</label>
                        <input type="text" name="name" placeholder="Thêm..." />
                    </div>
                    <button type="submit" className="save-btn">Thêm</button>
                </form>
                        </div>
                    </div>
                )
            }

    </div>
    );
};

export default BangDiemMonHoc;

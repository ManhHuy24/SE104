import React, { useState, useEffect } from 'react';
import './DanhSachHocSinh.css';

const DanhSachHocSinh = () => {
    // State  danh sách học sinh
    const [students, setStudents] = useState([]);

    useEffect(() => {
        // Dữ liệu tạm thời
        const mockData = [
            { id: 1, name: 'Nguyễn Văn A', class: '10A1', dtbHK1: 8.5, dtbHK2: 9.0 },
            { id: 2, name: 'Nguyễn Văn B', class: '10A2', dtbHK1: 7.0, dtbHK2: 7.5 },
            { id: 3, name: 'Nguyễn Văn C', class: '10A3', dtbHK1: 6.5, dtbHK2: 8.0 },
        ];
        setStudents(mockData); // update vào state
    }, []);

    return (
        <div>
            <h1>Danh sách học sinh</h1>
            <div className="card">
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Họ và tên</th>
                            <th>Lớp</th>
                            <th>Điểm TB học kì I</th>
                            <th>Điểm TB học kì II</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length > 0 ? (
                            students.map((student, index) => (
                                <tr key={student.id}>
                                    <td>{index + 1}</td>
                                    <td>{student.name}</td>
                                    <td>{student.class}</td>
                                    <td>{student.dtbHK1}</td>
                                    <td>{student.dtbHK2}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">Không có dữ liệu</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DanhSachHocSinh;

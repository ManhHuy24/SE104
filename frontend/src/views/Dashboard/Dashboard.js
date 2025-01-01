import React from "react";
import { Link } from 'react-router-dom';
import "./Dashboard.css";

const Dashboard = () => {
    return (
        <div className="sidebar-content">
            <div className="logo">
                <span className="title"><strong>STUDENT MANAGEMENT</strong></span>
            </div>

            <div className="menu-section">

                <div className="menu-category">QUẢN LÝ HỌC SINH</div>
                <Link to="/students-list">
                    <div className="menu-item">
                        Danh sách học sinh
                    </div>
                </Link>
                <Link to="/receive-students">
                    <div className="menu-item">
                        Tiếp nhận học sinh
                    </div>
                </Link>

                <div className="menu-category">QUẢN LÝ LỚP HỌC</div>
                <Link to="/manage-classes">
                    <div className="menu-item">
                        Quản lý lớp học
                    </div>
                </Link>
                <Link to="/create-class-list">
                    <div className="menu-item">
                        Lập danh sách lớp
                    </div>
                </Link>

                <div className="menu-category">QUẢN LÝ MÔN HỌC</div>
                <Link to="/manage-subjects">
                    <div className="menu-item">
                        Quản lý môn học
                    </div>
                </Link>
                <Link to="/subject-grades">
                    <div className="menu-item">
                        Bảng điểm môn học
                    </div>
                </Link>

                <div className="menu-category">CHỨC NĂNG</div>
                <Link to="/reports">
                    <div className="menu-item">
                        Báo cáo
                    </div>
                </Link>
                <Link to="/setting">
                    <div className="menu-item">
                        Cài đặt
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;

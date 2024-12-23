import React, { useState } from 'react';
import './BaoCao.css';

const BaoCao = () => {
    const [activeTab, setActiveTab] = useState("list");

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
      
    };

    return (
        <div>
            <div className="select-group-horizontal compact-layout">
                <select className="styled-select small-select">
                    <option value="HK1">Học kỳ I</option>
                    <option value="HK2">Học kỳ II</option>
                </select>
                <select className="styled-select small-select">
                    <option value="Toán">Toán</option>
                    <option value="Văn">Văn</option>
                    <option value="Anh">Anh</option>
                </select>
            </div>

            <div>
                <ul className="nav nav-tabs" role="tablist">
                    <li className={activeTab === "list" ? "active" : ""}>
                         <button onClick={() => setActiveTab("list")}>Danh sách</button>
                    </li>
                    <li className={activeTab === "chart" ? "active" : ""}>
                        <button onClick={() => setActiveTab("chart")}>Biểu đồ</button>
                    </li>
                </ul>
            </div>

            {/* Nội dung của tab */}
            {activeTab === "list" && (
                <div className="card">
                    <h3 className="title-report">BÁO CÁO TỔNG KẾT MÔN</h3>
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
                            <th className="text-center">Lớp</th>
                            <th className="text-center">Sĩ số</th>
                            <th className="text-center">Số lượng đạt</th>
                            <th className="text-center">Tỉ lệ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-center">1</td>
                            <td className="text-center">10A1</td>
                            <td className="text-center">40</td>
                            <td className="text-center">39</td>
                            <td className="text-center">0.9</td>
                        </tr>
                        <tr>
                            <td className="text-center">2</td>
                            <td className="text-center">10A2</td>
                            <td className="text-center">42</td>
                            <td className="text-center">30</td>
                            <td className="text-center">0.7</td>
        
                        </tr>
                    </tbody>
                </table>
                </div>
            )}

            {activeTab === "chart" && (
                <div className="card">
                    <h3 className="title-report">BIỂU ĐỒ BÁO CÁO</h3>
                    <p>Đây là "Biểu đồ cot".</p>
                </div>
            )}
        </div>
    );
};

export default BaoCao;

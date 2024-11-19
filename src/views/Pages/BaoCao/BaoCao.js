import React from 'react';
import './BaoCao.css'

const BaoCao = () => {
    return (
        <div>
            <div className="select-group">
              <div className="custom-select">
              <select className="styled-select">
                 <option value="HK1">Học kỳ I</option>
                 <option value="HK2">Học kỳ II</option>
              </select>
              <span className="dropdown-icon"><i className="bx bx-chevron-down"></i></span>
              </div>
        </div>
        
        <div>
         <ul class="nav nav-tabs" role="tablist">
        <li>
            <a href="#">Danh sách</a>
        </li>
        <li>
            <a href="#">Biểu đồ</a>
        </li>
        </ul>
        </div>


        </div>
    );
};

export default BaoCao;

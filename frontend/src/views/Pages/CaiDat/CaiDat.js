import React from "react";
import './CaiDat.css'

const CaiDat = () => {
    return (
        <div>
            <div className="card">
               <h3 class="title">THÊM NĂM HỌC</h3>
               <p class="note">Thêm niên khóa mới chỉ cần nhập năm hiện tại ứng dụng sẽ tự động lưu.
               <br />Ví dụ: Nhập 2023. Cơ sở dữ liệu sẽ lưu dưới dạng (2023-2024).</p>
               <div class="input-group">
                <label for="nienkhoa" className="setting-label">Năm học</label>
                <input type="text" id="nienkhoa" placeholder="Nhập năm học"/>
                <button id="addYear">Thêm</button>
               </div>
            </div>

            <div className="card">
               <h3 class="title">CÀI ĐẶT SỐ TUỔI</h3>
               <p class="note">Cài đặt số tuổi tối thiểu và tối đa để có thể nhập học.</p>
            <div className="age-container">
               <div class="input-agegroup">
                <label for="tuoi" className="setting-label">Số tuổi tối thiểu</label>
                <input type="text" id="tuoi" placeholder="Nhập..."/>
                <button id="addAge">Lưu</button>
               </div>
               <div class="input-agegroup">
                <label for="tuoi" className="setting-label">Số tuổi tối đa</label>
                <input type="text" id="tuoi" placeholder="Nhập..."/>
                <button id="addAge">Lưu</button>
               </div>
            </div>
            </div>

            <div className="card">
               <h3 class="title">CÀI ĐẶT ĐIỂM SỐ</h3>
               <p class="note">Cài đặt điểm số có thể ở lại lớp hoặc lên lớp & thang điểm.</p>
            <div className="score-container">
               <div class="input-scoregroup">
                <label for="diem" className="setting-label">Số điểm tối thiểu</label>
                <input type="text" id="diem" placeholder="Nhập..."/>
                <button id="addAge">Lưu</button>
               </div>
               <div class="input-scoregroup">
                <label for="diem" className="setting-label">Số điểm tối đa</label>
                <input type="text" id="diem" placeholder="Nhập..."/>
                <button id="addScore">Lưu</button>
               </div>
            </div>
            <div class="input-group">
                <label className="setting-label">Điểm đạt</label>
                <input type="text" placeholder="Nhập điểm đạt"/>
                <button>Lưu</button>
               </div>
            </div>

            <div className="card">
               <h3 class="title">CÀI ĐẶT SĨ SỐ</h3>
               <p class="note">Cài đặt sĩ số tối đa cho một lớp.</p>
               <div class="input-group">
                <label className="setting-label">Sĩ số</label>
                <input type="text" placeholder="Nhập sĩ số"/>
                <button>Lưu</button>
               </div>
            </div>
        </div>
    )
}

export default CaiDat;
import React, { useState, useEffect } from "react";
import './CaiDat.css';

const CaiDat = () => {
   const [nienKhoa, setNienKhoa] = useState('');
   const [tuoiToiThieu, setTuoiToiThieu] = useState('');
   const [tuoiToiDa, setTuoiToiDa] = useState('');
   const [siSo, setSiSo] = useState('');
   const [diemToiThieu, setDiemToiThieu] = useState('');
   const [diemToiDa, setDiemToiDa] = useState('');
   const [diemDat, setDiemDat] = useState('');

   useEffect(() => {
      fetch("http://localhost:5005/api/thamso")
          .then((response) => {
              if (!response.ok) {
                  throw new Error("Không thể tải dữ liệu tham số");
              }
              return response.json();
          })
          .then((data) => {
              if (data.length > 0) {
                  const thamSo = data[0];
                  setTuoiToiThieu(thamSo.TuoiHocSinhToiThieu || '');
                  setTuoiToiDa(thamSo.TuoiHocSinhToiDa || '');
                  setSiSo(thamSo.SoLuongHocSinhToiDa || '');
                  setDiemToiThieu(thamSo.DiemToiThieu || '');
                  setDiemToiDa(thamSo.DiemToiDa || '');
                  setDiemDat(thamSo.DiemDat || '');
              }
          })
          .catch((error) => {
              console.error("Lỗi khi tải dữ liệu tham số:", error);
          });
   }, []);

   const handleAddNamHoc = () => {
      fetch("http://localhost:5005/api/thamso/", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ nam1: nienKhoa }),
      })
         .then((response) => {
            if (!response.ok) {
               return response.json().then((errorData) => {
                  throw new Error(errorData.message);
               });
            }
            return response.json();
         })
         .then((data) => {
            if (data.namhoc) {
               alert(`${data.message} (${data.namhoc.MaNamHoc})`);
            }
            setNienKhoa("");
         })
         .catch((error) => {
            console.error(error);
            alert(`Lỗi: ${error.message}`);
         });
   };

   const handleSave = () => {
      // Kiểm tra ràng buộc
      if (!tuoiToiThieu || !tuoiToiDa || !siSo || !diemToiDa || !diemToiThieu || !diemDat) {
         alert("Vui lòng điền đầy đủ thông tin");
         return;
      }
      if (parseInt(tuoiToiThieu) >= parseInt(tuoiToiDa)) {
         alert("Tuổi tối thiểu phải nhỏ hơn tuổi tối đa");
         return;
      }
      if (parseInt(diemToiThieu) >= parseInt(diemToiDa)) {
         alert("Điểm tối thiểu phải nhỏ hơn điểm tối đa");
         return;
      }
      if (parseInt(diemDat) < parseInt(diemToiThieu) || parseInt(diemDat) > parseInt(diemToiDa)) {
         alert("Điểm đạt phải nằm trong khoảng từ điểm tối thiểu đến điểm tối đa");
         return;
      }
      if (parseInt(siSo) <= 0) {
         alert("Sĩ số tối đa phải lớn hơn 0");
         return;
      }

      const data = {
         TuoiHocSinhToiThieu: tuoiToiThieu,
         TuoiHocSinhToiDa: tuoiToiDa,
         SoLuongHocSinhToiDa: siSo,
         DiemToiDa: diemToiDa,
         DiemToiThieu: diemToiThieu,
         DiemDat: diemDat
      };

      fetch('http://localhost:5005/api/thamso', {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(data),
      })
         .then((response) => {
            if (!response.ok) {
               return response.json().then((errorData) => {
                  throw new Error(errorData.message);
               });
            }
            return response.json();
         })
         .then((updatedData) => {
            console.log('Updated:', updatedData);
            alert("Đã lưu thay đổi thành công");
         })
         .catch((error) => {
            console.error(error);
            alert(`Lỗi: ${error.message}`);
         });
   };

   return (
      <div>
         <div className="card">
            <h3 className="title">THÊM NĂM HỌC</h3>
            <p className="note">
               Thêm niên khóa mới chỉ cần nhập năm hiện tại, ứng dụng sẽ tự động lưu.
               <br />Ví dụ: Nhập 2023. Cơ sở dữ liệu sẽ lưu dưới dạng (2023-2024).
            </p>
            <div className="input-group">
               <label htmlFor="nienkhoa" className="setting-label">Năm học</label>
               <input
                  type="text"
                  id="nienkhoa"
                  placeholder="Nhập năm học"
                  value={nienKhoa}
                  onChange={(e) => setNienKhoa(e.target.value)}
               />
               <button onClick={handleAddNamHoc}>Thêm</button>
            </div>
         </div>

         <div className="card">
               <h3 className="title">CÀI ĐẶT SỐ TUỔI</h3>
               <p className="note">Cài đặt số tuổi tối thiểu và tối đa để có thể nhập học.</p>
               <div className="age-container">
                  <div className="input-agegroup">
                     <label htmlFor="tuoiToiThieu" className="setting-label">Số tuổi tối thiểu</label>
                     <input
                           type="text"
                           id="tuoiToiThieu"
                           placeholder="Nhập..."
                           value={tuoiToiThieu}
                           onChange={(e) => setTuoiToiThieu(e.target.value)}
                     />
                  </div>
                  <div className="input-agegroup">
                     <label htmlFor="tuoiToiDa" className="setting-label">Số tuổi tối đa</label>
                     <input
                           type="text"
                           id="tuoiToiDa"
                           placeholder="Nhập..."
                           value={tuoiToiDa}
                           onChange={(e) => setTuoiToiDa(e.target.value)}
                     />
                  </div>
               </div>
         </div>

         <div className="card">
               <h3 className="title">CÀI ĐẶT ĐIỂM SỐ</h3>
               <p className="note">Cài đặt điểm số có thể ở lại lớp hoặc lên lớp & thang điểm.</p>
               <div className="score-container">
                  <div className="input-scoregroup">
                     <label htmlFor="diemToiThieu" className="setting-label">Số điểm tối thiểu</label>
                     <input
                           type="text"
                           id="diemToiThieu"
                           placeholder="Nhập..."
                           value={diemToiThieu}
                           onChange={(e) => setDiemToiThieu(e.target.value)}
                     />
                  </div>
                  <div className="input-scoregroup">
                     <label htmlFor="diemToiDa" className="setting-label">Số điểm tối đa</label>
                     <input
                           type="text"
                           id="diemToiDa"
                           placeholder="Nhập..."
                           value={diemToiDa}
                           onChange={(e) => setDiemToiDa(e.target.value)}
                     />
                  </div>
               </div>
               <div className="input-group">
                  <label className="setting-label">Điểm đạt</label>
                  <input
                     type="text"
                     placeholder="Nhập điểm đạt"
                     value={diemDat}
                     onChange={(e) => setDiemDat(e.target.value)}
                  />
               </div>
         </div>

         <div className="card">
               <h3 className="title">CÀI ĐẶT SĨ SỐ</h3>
               <p className="note">Cài đặt sĩ số tối đa cho một lớp.</p>
               <div className="input-group">
                  <label className="setting-label">Sĩ số</label>
                  <input
                     type="text"
                     placeholder="Nhập sĩ số"
                     value={siSo}
                     onChange={(e) => setSiSo(e.target.value)}
                  />
               </div>
         </div>
         
         <div className="save-button">
            <button onClick={handleSave}>Lưu</button>
         </div>
      </div>
   );
};

export default CaiDat;

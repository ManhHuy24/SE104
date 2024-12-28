import React, { useState, useEffect } from "react";
import "./BaoCao.css";
import BarChart from "./BarChart";

const Dropdown = ({ options, value, onChange, placeholder }) => (
  <select className="styled-select small-select" value={value} onChange={onChange}>
    <option value="">{placeholder}</option>
    {options.map((item) => (
      <option key={item.id || item.MaNamHoc} value={item.id || item.MaNamHoc}>
        {item.name || item.MaNamHoc}
      </option>
    ))}
  </select>
);

const ReportTable = ({ data, columns, handleSearch }) => (
  <div>
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
          {columns.map((col) => (
            <th key={col} className="text-center">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td className="text-center">{index + 1}</td>
            <td className="text-center">{item.TenLop}</td>
            <td className="text-center">{item.SiSo}</td>
            <td className="text-center">{item.SoLuongDat}</td>
            <td className="text-center">
                {item.SiSo > 0 ? ((item.SoLuongDat / item.SiSo) * 100).toFixed(2) : "0.00"}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const BaoCao = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [filters, setFilters] = useState({ year: "", semester: "", subject: "" });
  const [data, setData] = useState({ years: [], semesters: [], subjects: [], report: [], semesterReport: [] });
  const [filteredData, setFilteredData] = useState({ report: [], semesterReport: [] });
  const [loading, setLoading] = useState(false);

  const fetchData = async (url, setter) => {
    try {
      const response = await fetch(url);
      const result = await response.json();
      setter(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error(`Error fetching from ${url}:`, error);
      setter([]);
    }
  };

  useEffect(() => {
    // Fetch years, semesters, and subjects independently
    fetchData("http://localhost:5005/api/reports/years", (years) => setData((prev) => ({ ...prev, years })));
    fetchData("http://localhost:5005/api/reports/semesters", (semesters) => setData((prev) => ({ ...prev, semesters })));
    fetchData("http://localhost:5005/api/reports/subjects", (subjects) => setData((prev) => ({ ...prev, subjects })));
  }, []);

  useEffect(() => {
    if (filters.year && filters.semester && filters.subject) {
      // Fetch subject summary report
      setLoading(true);
      fetchData(
        `http://localhost:5005/api/reports/tkmh?hocKy=${filters.semester}&monHoc=${filters.subject}&namHoc=${filters.year}`,
        (report) => {
          setData((prev) => ({ ...prev, report }));
          setFilteredData((prev) => ({ ...prev, report }));
          setLoading(false);
        }
      );
    }
  }, [filters.year, filters.semester, filters.subject]);

  useEffect(() => {
    if (filters.year && filters.semester) {
      // Fetch semester summary report
      setLoading(true);
      fetchData(
        `http://localhost:5005/api/reports/tkhk?hocKy=${filters.semester}&namHoc=${filters.year}`,
        (semesterReport) => {
          setData((prev) => ({ ...prev, semesterReport }));
          setFilteredData((prev) => ({ ...prev, semesterReport }));
          setLoading(false);
        }
      );
    }
  }, [filters.year, filters.semester]);

  const handleSearch = (key, query) => {
    const lowerQuery = query.toLowerCase();
    setFilteredData((prev) => ({
      ...prev,
      [key]: data[key].filter((item) => item.TenLop.toLowerCase().includes(lowerQuery)),
    }));
  };

  const reportLabels = data.report.map((item) => item.TenLop);
  const reportData = data.report.map((item) =>
    item.SiSo > 0 ? ((item.SoLuongDat / item.SiSo) * 100).toFixed(2) : 0
  );
  
  const semesterLabels = data.semesterReport.map((item) => item.TenLop);
  const semesterData = data.semesterReport.map((item) =>
    item.SiSo > 0 ? ((item.SoLuongDat / item.SiSo) * 100).toFixed(2) : 0
  );
  
  
  


  return (
    <div>
      <div className="select-group-horizontal compact-layout">
        <Dropdown
          options={data.years}
          value={filters.year}
          onChange={(e) => setFilters((prev) => ({ ...prev, year: e.target.value }))}
          placeholder="Chọn năm học"
        />
        <Dropdown
          options={data.semesters}
          value={filters.semester}
          onChange={(e) => setFilters((prev) => ({ ...prev, semester: e.target.value }))}
          placeholder="Chọn học kỳ"
        />
        <Dropdown
          options={data.subjects}
          value={filters.subject}
          onChange={(e) => setFilters((prev) => ({ ...prev, subject: e.target.value }))}
          placeholder="Chọn môn học"
        />
      </div>

      <div>
        <ul className="nav nav-tabs" role="tablist">
          {[
            { key: "list", label: "Báo cáo Tổng kết Môn học" },
            { key: "tkhk", label: "Báo cáo Tổng kết Học kỳ" },
            { key: "chart", label: "Biểu đồ" },
          ].map((tab) => (
            <li key={tab.key} className={activeTab === tab.key ? "active" : ""}>
              <button onClick={() => setActiveTab(tab.key)}>{tab.label}</button>
            </li>
          ))}
        </ul>
      </div>

      {activeTab === "list" && (
        <div className="card">
          <h3 className="title-report">BÁO CÁO TỔNG KẾT MÔN</h3>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ReportTable
              data={filteredData.report}
              columns={["STT", "Lớp", "Sĩ số", "Số lượng đạt", "Tỉ lệ"]}
              handleSearch={(e) => handleSearch("report", e.target.value)}
            />
          )}
        </div>
      )}

      {activeTab === "tkhk" && (
        <div className="card">
          <h3 className="title-report">BÁO CÁO TỔNG KẾT HỌC KỲ</h3>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ReportTable
              data={filteredData.semesterReport}
              columns={["STT", "Lớp", "Sĩ số", "Số lượng đạt", "Tỉ lệ"]}
              handleSearch={(e) => handleSearch("semesterReport", e.target.value)}
            />
          )}
        </div>
      )}

    {activeTab === "chart" && (
        <div className="card">
          <h3 className="title-report">BIỂU ĐỒ BÁO CÁO</h3>
          <BarChart
                labels={reportLabels}
                data={reportData}
                title="Tỉ lệ đạt Tổng kết Môn học"
          />
          {semesterData.length > 0 && (
            <BarChart
                labels={semesterLabels}
                data={semesterData}
                title="Tỉ lệ đạt Tổng kết Học kỳ"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default BaoCao;

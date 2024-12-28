import React, { useState, useEffect } from 'react';
import './BangDiemMonHoc.css';

const BangDiemMonHoc = () => {
    const [scores, setScores] = useState([]);
    const [years, setYears] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        MaNamHoc: '',
        MaLop: '',
        MaMonHoc: '',
        MaHocKy: 1, // Change from 'HK1' to 1
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentScore, setCurrentScore] = useState(null);
    const [updatedScore, setUpdatedScore] = useState({ Diem15Phut: '', Diem1Tiet: '', DiemHocKy: '' });

    const semesterOptions = [
        { value: 1, label: 'Học kỳ I' },
        { value: 2, label: 'Học kỳ II' }
    ];

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                setIsLoading(true);
                const [yearsResponse, classesResponse, subjectsResponse] = await Promise.all([
                    fetch('http://localhost:5005/api/years').then(res => res.json()),
                    fetch('http://localhost:5005/classes').then(res => res.json()),
                    fetch('http://localhost:5005/api/subjects').then(res => res.json()),
                ]);

                setYears(yearsResponse || []);
                setClasses(classesResponse || []);
                setSubjects(subjectsResponse || []);

                setFilters(filters => ({
                    ...filters,
                    MaNamHoc: yearsResponse[0]?.MaNamHoc || '',
                    MaLop: classesResponse[0]?.MaLop || '',
                    MaMonHoc: subjectsResponse[0]?.MaMonHoc || '',
                }));
            } catch (err) {
                setError('Failed to fetch dropdown data.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDropdownData();
    }, []);

    const fetchScores = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            console.log('Sending request with filters:', filters);
            
            const response = await fetch('http://localhost:5005/api/scores/get-scores', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(filters),
            });
            
            // Log the raw response for debugging
            console.log('Response status:', response.status);
            
            const text = await response.text();
            console.log('Raw response:', text);
            
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                throw new Error('Invalid JSON response from server');
            }
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch scores');
            }
            
            setScores(data.data || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch scores');
            console.error('Error details:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (filters.MaNamHoc && filters.MaLop && filters.MaMonHoc) {
            fetchScores();
        }
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleEditClick = (score) => {
        setCurrentScore(score);
        setUpdatedScore({
            Diem15Phut: score.Diem15Phut || '',
            Diem1Tiet: score.Diem1Tiet || '',
            DiemHocKy: score.DiemHocKy || '',
        });
        setIsModalOpen(true);
    };

    const handleScoreChange = (e) => {
        const { name, value } = e.target;
        setUpdatedScore({ ...updatedScore, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5005/api/scores/add-or-update-score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    MaBD_MH: currentScore.MaBD_MH,
                    MaLKT: 1, // Example MaLKT for 15 minutes test
                    KetQua: updatedScore.Diem15Phut,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update score');
            }
            setIsModalOpen(false);
            fetchScores();
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <div>
            <h1>Bảng điểm môn học</h1>
            {isLoading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            <div className="select-group-scorelist">
                <div className="select-group">
                    <label htmlFor="year-select" className="select-label">Niên khóa</label>
                    <select id="year-select" name="MaNamHoc" value={filters.MaNamHoc} onChange={handleFilterChange} className="styled-select">
                        {years.map(year => (
                            <option key={year.MaNamHoc} value={year.MaNamHoc}>
                                {year.Nam1}-{year.Nam2}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="select-group">
                    <label htmlFor="class-select" className="select-label">Lớp</label>
                    <select id="class-select" name="MaLop" value={filters.MaLop} onChange={handleFilterChange} className="styled-select">
                        {classes.map(cls => (
                            <option key={cls.MaLop} value={cls.MaLop}>
                                {cls.TenLop}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="select-group">
                    <label htmlFor="sub-select" className="select-label">Môn học</label>
                    <select id="sub-select" name="MaMonHoc" value={filters.MaMonHoc} onChange={handleFilterChange} className="styled-select">
                        {subjects.map(subject => (
                            <option key={subject.MaMonHoc} value={subject.MaMonHoc}>
                                {subject.TenMonHoc}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="select-group">
                    <label htmlFor="sem-select" className="select-label">Học kỳ</label>
                    <select 
                        id="sem-select" 
                        name="MaHocKy" 
                        value={filters.MaHocKy} 
                        onChange={handleFilterChange} 
                        className="styled-select"
                    >
                        {semesterOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
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
                        </tr>
                    </thead>
                    <tbody>
                        {scores.length ? (
                            scores.map((score) => (
                                <tr key={score.MaHocSinh}>
                                    <td className="text-center">{score.MaHocSinh}</td>
                                    <td className="text-center">{score.TenHocSinh}</td>
                                    <td className="text-center">{score.Diem15Phut !== null ? score.Diem15Phut : 'N/A'}</td>
                                    <td className="text-center">{score.Diem1Tiet !== null ? score.Diem1Tiet : 'N/A'}</td>
                                    <td className="text-center">{score.DiemHocKy !== null ? score.DiemHocKy : 'N/A'}</td>
                                    <td className="text-center">
                                        <button className="btn btn-edit" onClick={() => handleEditClick(score)}>Chỉnh sửa</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">Không có dữ liệu học sinh.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <>
                    <div className="modal-overlay" onClick={() => setIsModalOpen(false)}></div>
                    <div className="modal">
                        <form onSubmit={handleSubmit}>
                            <label>
                                Điểm 15 phút:
                                <input
                                    type="text"
                                    name="Diem15Phut"
                                    value={updatedScore.Diem15Phut}
                                    onChange={handleScoreChange}
                                />
                            </label>
                            <label>
                                Điểm 1 tiết:
                                <input
                                    type="text"
                                    name="Diem1Tiet"
                                    value={updatedScore.Diem1Tiet}
                                    onChange={handleScoreChange}
                                />
                            </label>
                            <label>
                                Điểm học kỳ:
                                <input
                                    type="text"
                                    name="DiemHocKy"
                                    value={updatedScore.DiemHocKy}
                                    onChange={handleScoreChange}
                                />
                            </label>
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        </form>
                    </div>
                </>
            )}

        </div>
    );
};

export default BangDiemMonHoc;

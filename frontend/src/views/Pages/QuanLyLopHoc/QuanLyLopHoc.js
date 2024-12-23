import React, { useState, useEffect } from 'react';
import './QuanLyLopHoc.css';

const QuanLyLopHoc = () => {
    const [showAddClassModel, setShowAddClassModel] = useState(false);
    const [className, setClassName] = useState('');
    const [showEditClassModel, setShowEditClassModel] = useState(false);
    const [classes, setClasses] = useState([]); // State to hold class data
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [grade, setGrade] = useState('Khối 10');

     // Fetch data from the database
     useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await fetch('http://localhost:5000/classes'); // Adjust API endpoint as necessary
                if (!response.ok) {
                    throw new Error('Failed to fetch classes');
                }
                const data = await response.json();
                setClasses(data);
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };

        fetchClasses();
    }, []);

    const handleAddClass = () => {
        setShowAddClassModel(true);
    };

    const closeAddClassModel = () => {
        setShowAddClassModel(false);
    };


    const handleEditClass = () => {
        setShowEditClassModel(true);
    };

    const closeEditClassModel = () => {
        setShowEditClassModel(false);
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        const newClass = {
            TenLop: className,
            TenKhoi: grade,
        };

        try {
            const response = await fetch('http://localhost:5000/classes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newClass),
            });

            if (response.ok) {
                console.log('Class added successfully');
                // Optionally, close the modal and refresh the list of classes
                setShowAddClassModel(false);
            } else {
                console.error('Failed to add class');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Filtered class list based on search query
    const filteredClasses = classes.filter((cls) =>
        cls.TenLop.toLowerCase().includes(searchQuery) ||
        cls.TenKhoi.toLowerCase().includes(searchQuery)
    );

    return (
        <div className="container">
            <h1 className="h1.tiepnhan">Quản lý lớp học</h1>
            <div className="button-group">
                <button className="btn btn-primary" onClick={handleAddClass}>
                    <i className="bx bx-plus"></i> Thêm lớp học mới
                </button>
            </div>

            <div className="table-responsive">
                {/* Ô tìm kiếm */}
                <div className="search-bar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Tìm kiếm lớp học..."
                        onChange={handleSearch}
                    />
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th className="text-center">STT</th>
                            <th className="text-center">Tên lớp học</th>
                            <th className="text-center">Khối lớp</th>
                            <th className="text-center">Chỉnh sửa</th>
                            <th className="text-center">Xoá</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClasses.map((cls, index) => (
                            <tr key={cls.MaLop}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">{cls.TenLop}</td>
                                <td className="text-center">{cls.TenKhoi}</td>
                                <td className="text-center">
                                    <button className="btn btn-edit" onClick={() => handleEditClass()}>
                                        <i className="bx bxs-edit"></i>
                                    </button>
                                </td>
                                <td className="text-center">
                                    <button className="btn btn-delete"><i className="bx bx-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {
                showAddClassModel && (
                    <div className="modal-add-class">
                        <div className="modal-content-add-class">
                            <span className="close-add-class" onClick={closeAddClassModel}>&times;</span>
                            <h2>Thêm lớp học</h2>
                            <form className="form-add-class">
                                <div className="form-row-add-class">
                                    <label>Tên lớp học:</label>
                                    <input type="text" name="classname" placeholder="Lớp 10A1" />
                                </div>
                                <div className="form-row-add-class">
                                    <label>Tên khối:</label>
                                    <select name="grade">
                                        <option value="Khối 10">Khối 10</option>
                                        <option value="Khối 11">Khối 11</option>
                                        <option value="Khối 12">Khối 12</option>
                                    </select>
                                </div>
                                <button type="submit" className="save-btn-add-class">Thêm</button>
                            </form>
                        </div>
                    </div>
                )
            }


            {
                showEditClassModel && (
                    <div className="modal-add-class">
                        <div className="modal-content-add-class">
                            <span className="close-add-class" onClick={closeEditClassModel}>&times;</span>
                            <h2>Chỉnh sửa lớp học</h2>
                            <form className="form-add-class">
                                <div className="form-row-add-class">
                                    <label>Mã lớp học:</label>
                                    <input type="text" name="classname" placeholder="1" readOnly className="styled-input read-only-input"/>
                                </div>
                                <div className="form-row-add-class">
                                    <label>Tên lớp học:</label>
                                    <input type="text" name="classname" placeholder="Lớp 10A1" />
                                </div>
                                <div className="form-row-add-class">
                                    <label>Tên khối:</label>
                                    <select name="grade">
                                        <option value="Khối 10">Khối 10</option>
                                        <option value="Khối 11">Khối 11</option>
                                        <option value="Khối 12">Khối 12</option>
                                    </select>
                                </div>
                                <button type="submit" className="save-btn-add-class">Cập nhật</button>
                            </form>
                        </div>
                    </div>
                )
            }

        </div>
    );
};

export default QuanLyLopHoc;

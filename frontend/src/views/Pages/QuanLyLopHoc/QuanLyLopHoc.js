import React, { useState, useEffect } from 'react';
import './QuanLyLopHoc.css';

const QuanLyLopHoc = () => {
    const [showAddClassModel, setShowAddClassModel] = useState(false);
    const [className, setClassName] = useState('');
    const [showEditClassModel, setShowEditClassModel] = useState(false);
    const [classes, setClasses] = useState([]); // State to hold class data
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [filteredClasses, setFilteredClasses] = useState([]);
    const [grade, setGrade] = useState('Khối 10');
    const [editingClass, setEditingClass] = useState(null); // To hold the class being edited

    const fetchClasses = async () => {
        try {
            const response = await fetch(`http://localhost:5005/classes`); // Adjust API endpoint as necessary
            if (!response.ok) {
                throw new Error('Failed to fetch classes');
            }
            const data = await response.json();
            setClasses(data);
            setFilteredClasses(data); // Initially display all classes
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

     // Fetch data from the database
     useEffect(() => {
        fetchClasses();
    }, []);

    // Normalize text for consistent searching
    const normalizeText = (text) => {
        return text.toLowerCase().replace(/\s+/g, ' ').trim(); // Lowercase, remove extra spaces
    };

    // Handle search input changes
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value); // Update the search query state
    };

    // Perform search on Enter key press
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            const query = normalizeText(searchQuery);
            const filtered = classes.filter((cls) =>
                normalizeText(cls.TenLop).includes(query)
            );
            setFilteredClasses(filtered); // Update the filtered classes
        }
    };

    const handleAddClass = () => {
        setShowAddClassModel(true);
    };

    const closeAddClassModel = () => {
        setShowAddClassModel(false);
    };

    const handleEditClass = (cls) => {
        setEditingClass(cls); // Set the class being edited
        setClassName(cls.TenLop); // Populate the form with the current name
        setGrade(cls.TenKhoi); // Populate the form with the current grade
        setShowEditClassModel(true);
    };

    const closeEditClassModel = () => {
        setShowEditClassModel(false);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        const newClass = {
            TenLop: className, // Value from form input
            TenKhoi: grade,    // Value from dropdown selection
        };

        try {
            const response = await fetch('http://localhost:5005/classes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newClass),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Class added successfully', data);
                alert(`Lớp học đã được thêm thành công với ID: ${data.id}`);
                setShowAddClassModel(false);
                fetchClasses(); // Refresh the list of classes
            } else {
                const error = await response.json();
                alert(`Failed to add class: ${error.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteClass = async (id) => {
        
        console.log(`Deleting class with ID: ${id}`); // Log ID
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa lớp học này?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:5005/classes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert('Xóa lớp học thành công!');
                setClasses(classes.filter((cls) => cls.MaLop !== id));
            } else {
                alert('Không thể xóa lớp học. Hãy thử lại.');
            }
        } catch (error) {
            console.error('Error deleting class:', error);
            alert('Đã xảy ra lỗi khi xóa lớp học.');
        }
    };

    const handleEditFormSubmit = async (event) => {
        event.preventDefault();
    
        const updatedClass = {
            TenLop: className,
            TenKhoi: grade,
        };
    
        try {
            const response = await fetch(`http://localhost:5005/classes/${editingClass.MaLop}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedClass),
            });
    
            if (response.ok) {
                alert('Cập nhật lớp học thành công!');
                setShowEditClassModel(false);
                fetchClasses(); // Refresh the list of classes
            } else {
                const error = await response.json();
                alert(`Không thể cập nhật lớp học: ${error.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

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
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyPress={handleKeyPress} // Trigger search on Enter
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
                                    <button className="btn btn-edit" onClick={() => handleEditClass(cls)}>
                                        <i className="bx bxs-edit"></i>
                                    </button>
                                </td>
                                <td className="text-center">
                                    <button className="btn btn-delete" onClick={() => handleDeleteClass(cls.MaLop)}><i className="bx bx-trash"></i></button>
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
                            <form className="form-add-class" onSubmit={handleFormSubmit}>
                                <div className="form-row-add-class">
                                    <label>Tên lớp học:</label>
                                    <input type="text" name="classname" value={className} onChange={(e) => setClassName(e.target.value)} placeholder="Lớp 10A1" />
                                </div>
                                <div className="form-row-add-class">
                                    <label>Tên khối:</label>
                                    <select name="grade" value={grade} onChange={(e) => setGrade(e.target.value)}>
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
                            <form className="form-add-class" onSubmit={handleEditFormSubmit}>
                                <div className="form-row-add-class">
                                    <label>Mã lớp học:</label>
                                    <input type="text" name="classname" value={editingClass?.MaLop || ''} placeholder="1" readOnly className="styled-input read-only-input"/>
                                </div>
                                <div className="form-row-add-class">
                                    <label>Tên lớp học:</label>
                                    <input type="text" name="classname" value={className} onChange={(e) => setClassName(e.target.value)} placeholder="Lớp 10A1" />
                                </div>
                                <div className="form-row-add-class">
                                    <label>Tên khối:</label>
                                    <select name="grade" value={grade} onChange={(e) => setGrade(e.target.value)}>
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

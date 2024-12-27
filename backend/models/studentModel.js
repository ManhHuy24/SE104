const db = require('../config/db'); // MySQL connection pool

const Student = {
  // Fetch all students
  getAll: async () => {
    try {
      const query = `
        SELECT 
          hs.MaHocSinh, 
          hs.TenHocSinh, 
          DATE_FORMAT(hs.NgaySinh, '%Y-%m-%d') AS NgaySinh, 
          hs.GioiTinh, 
          hs.DiaChi, 
          hs.Email,
          l.TenLop, 
          kl.TenKhoi, 
          dsl.SiSo
        FROM HOCSINH hs
        LEFT JOIN CT_DSL ct ON hs.MaHocSinh = ct.MaHocSinh
        LEFT JOIN DANHSACHLOP dsl ON ct.MaDanhSachLop = dsl.MaDanhSachLop
        LEFT JOIN LOP l ON dsl.MaLop = l.MaLop
        LEFT JOIN KHOILOP kl ON l.MaKhoi = kl.MaKhoi;
      `;
      const [rows] = await db.query(query);
      return rows;
    } catch (err) {
      throw new Error(`Error fetching students: ${err.message}`);
    }
  },

  // Fetch students filtered by school year
  getByYear: async (schoolYear) => {
    try {
      const [year1, year2] = schoolYear.split('-').map(Number);
      const query = `
        SELECT DISTINCT
          hs.MaHocSinh, 
          hs.TenHocSinh, 
          DATE_FORMAT(hs.NgaySinh, '%Y-%m-%d') AS NgaySinh, 
          hs.GioiTinh,
          hs.DiaChi, 
          hs.Email,
          l.TenLop,
          kl.TenKhoi,
          dsl.SiSo
        FROM HOCSINH hs
        JOIN CT_DSL ct ON hs.MaHocSinh = ct.MaHocSinh
        JOIN DANHSACHLOP dsl ON ct.MaDanhSachLop = dsl.MaDanhSachLop
        JOIN LOP l ON dsl.MaLop = l.MaLop
        JOIN KHOILOP kl ON l.MaKhoi = kl.MaKhoi
        JOIN NAMHOC nh ON dsl.MaNamHoc = nh.MaNamHoc
        WHERE nh.Nam1 = ? AND nh.Nam2 = ?
      `;
      
      const [rows] = await db.query(query, [year1, year2]);
      return rows;
    } catch (err) {
      console.error('Database error:', err);
      throw new Error('Error fetching students by year: ' + err.message);
    }
  },

  // Fetch a student by ID
  getById: async (id) => {
    try {
      const query = `
        SELECT 
          hs.MaHocSinh, hs.TenHocSinh, DATE_FORMAT(hs.NgaySinh, '%d/%m/%Y') AS NgaySinh, 
          hs.GioiTinh, hs.DiaChi, hs.Email 
        FROM HOCSINH hs 
        WHERE hs.MaHocSinh = ?`;
      const [rows] = await db.query(query, [id]);
      return rows[0];
    } catch (err) {
      throw new Error(`Error fetching student: ${err.message}`);
    }
  },

  // Add a new student
  create: async (student) => {
    try {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(student.Email)) {
            throw new Error('Invalid email format');
        }

        // Check for duplicate email
        const duplicateCheckQuery = `SELECT * FROM HOCSINH WHERE Email = ?`;
        const [duplicateRows] = await db.query(duplicateCheckQuery, [student.Email]);
        if (duplicateRows.length > 0) {
            throw new Error('A student with this email already exists');
        }

        // Proceed with insertion
        const query = `
            INSERT INTO HOCSINH (TenHocSinh, NgaySinh, GioiTinh, DiaChi, Email) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [
            student.TenHocSinh,
            student.NgaySinh,
            student.GioiTinh,
            student.DiaChi,
            student.Email,
        ]);

        return { MaHocSinh: result.insertId };
    } catch (err) {
        throw new Error(`Error adding student: ${err.message}`);
    }
  },

  // Update student details
  updateById: async (id, student) => {
    try {
        // Validate email format if email is being updated
        if (student.Email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(student.Email)) {
                throw new Error('Invalid email format');
            }

            // Check if the new email is already in use by another student
            const duplicateCheckQuery = `
                SELECT * FROM HOCSINH 
                WHERE Email = ? AND MaHocSinh != ?
            `;
            const [duplicateRows] = await db.query(duplicateCheckQuery, [student.Email, id]);
            if (duplicateRows.length > 0) {
                throw new Error('Another student with this email already exists');
            }
        }

        // Fetch current details
        const currentStudentQuery = `SELECT * FROM HOCSINH WHERE MaHocSinh = ?`;
        const [currentStudentRows] = await db.query(currentStudentQuery, [id]);
        if (currentStudentRows.length === 0) {
            throw new Error('Student not found');
        }

        const currentStudent = currentStudentRows[0];
        const updatedStudent = {
            TenHocSinh: student.TenHocSinh || currentStudent.TenHocSinh,
            NgaySinh: student.NgaySinh || currentStudent.NgaySinh,
            GioiTinh: student.GioiTinh || currentStudent.GioiTinh,
            DiaChi: student.DiaChi || currentStudent.DiaChi,
            Email: student.Email || currentStudent.Email,
        };

        const updateQuery = `
            UPDATE HOCSINH 
            SET TenHocSinh = ?, NgaySinh = ?, GioiTinh = ?, DiaChi = ?, Email = ? 
            WHERE MaHocSinh = ?
        `;
        const [result] = await db.query(updateQuery, [
            updatedStudent.TenHocSinh,
            updatedStudent.NgaySinh,
            updatedStudent.GioiTinh,
            updatedStudent.DiaChi,
            updatedStudent.Email,
            id,
        ]);

        return result;
    } catch (err) {
        throw new Error(`Error updating student: ${err.message}`);
    }
  },

  // Delete a student method remains unchanged
  // Delete a student method updated
  deleteById: async (id) => {
    try {
        // Check if the student exists
        const studentCheckQuery = `SELECT * FROM HOCSINH WHERE MaHocSinh = ?`;
        const [studentRows] = await db.query(studentCheckQuery, [id]);
        if (studentRows.length === 0) {
            throw new Error('Student not found');
        }

        // Fetch the MaDanhSachLop the student is associated with
        const classQuery = `
            SELECT MaDanhSachLop 
            FROM CT_DSL 
            WHERE MaHocSinh = ?
        `;
        const [classRows] = await db.query(classQuery, [id]);

        // If the student is not associated with a class, proceed with deletion
        const MaDanhSachLop = classRows.length > 0 ? classRows[0].MaDanhSachLop : null;

        // Start a transaction
        await db.query('START TRANSACTION');

        // Delete from BD_THANHPHAN
        await db.query(`
            DELETE BD_THANHPHAN
            FROM BD_THANHPHAN
            JOIN BD_MONHOC ON BD_THANHPHAN.MaBD_MH = BD_MONHOC.MaBD_MH
            JOIN BANGDIEM ON BD_MONHOC.MaBangDiem = BANGDIEM.MaBangDiem
            JOIN CT_DSL ON BANGDIEM.MaCT_DSL = CT_DSL.MaCT_DSL
            WHERE CT_DSL.MaHocSinh = ?
        `, [id]);

        // Delete from BD_MONHOC
        await db.query(`
            DELETE BD_MONHOC
            FROM BD_MONHOC
            JOIN BANGDIEM ON BD_MONHOC.MaBangDiem = BANGDIEM.MaBangDiem
            JOIN CT_DSL ON BANGDIEM.MaCT_DSL = CT_DSL.MaCT_DSL
            WHERE CT_DSL.MaHocSinh = ?
        `, [id]);

        // Delete from BANGDIEM
        await db.query(`
            DELETE BANGDIEM
            FROM BANGDIEM
            JOIN CT_DSL ON BANGDIEM.MaCT_DSL = CT_DSL.MaCT_DSL
            WHERE CT_DSL.MaHocSinh = ?
        `, [id]);

        // Delete from CT_DSL
        await db.query(`
            DELETE FROM CT_DSL
            WHERE MaHocSinh = ?
        `, [id]);

        // Finally, delete the student
        const [result] = await db.query(`
            DELETE FROM HOCSINH
            WHERE MaHocSinh = ?
        `, [id]);

        // If the student was associated with a class, decrement the SiSo
        if (MaDanhSachLop) {
            await db.query(`
                UPDATE DANHSACHLOP
                SET SiSo = SiSo - 1
                WHERE MaDanhSachLop = ?
            `, [MaDanhSachLop]);
        }

        // Commit the transaction
        await db.query('COMMIT');

        return result;
    } catch (err) {
        // Rollback the transaction in case of an error
        await db.query('ROLLBACK');
        throw new Error(`Error deleting student: ${err.message}`);
    }
  },

  addToClass: async (MaHocSinh, MaNamHoc, MaLop) => {
    try {
        // Get MaDanhSachLop for the provided MaNamHoc and MaLop
        const queryGetClass = `
            SELECT MaDanhSachLop 
            FROM DANHSACHLOP 
            WHERE MaNamHoc = ? AND MaLop = ?
        `;
        const [classRows] = await db.query(queryGetClass, [MaNamHoc, MaLop]);

        if (classRows.length === 0) {
            throw new Error('Class-year mapping not found');
        }
        const MaDanhSachLop = classRows[0].MaDanhSachLop;

        // Insert into CT_DSL (mapping table for students and class lists)
        const queryAddToClass = `
            INSERT INTO CT_DSL (MaHocSinh, MaDanhSachLop)
            VALUES (?, ?)
        `;
        await db.query(queryAddToClass, [MaHocSinh, MaDanhSachLop]);

        return { message: 'Student added to class successfully' };
    } catch (err) {
        throw new Error(`Error adding student to class: ${err.message}`);
    }
  },

  // Fetch a student by Email
  getByEmail: async (email) => {
    try {
        const query = `
            SELECT 
                hs.MaHocSinh, 
                hs.TenHocSinh, 
                DATE_FORMAT(hs.NgaySinh, '%Y-%m-%d') AS NgaySinh, 
                hs.GioiTinh, 
                hs.DiaChi, 
                hs.Email
            FROM HOCSINH hs
            WHERE hs.Email = ?
        `;
        const [rows] = await db.query(query, [email]);
        return rows[0]; // Return the first match or undefined if no match is found
    } catch (err) {
        throw new Error(`Error fetching student by email: ${err.message}`);
    }
  },
};

module.exports = Student;
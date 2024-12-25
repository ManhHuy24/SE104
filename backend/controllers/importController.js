const multer = require('multer');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const Student = require('../models/studentModel');
const axios = require('axios');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

const fetchThamso = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/thamso');
        return response.data; // Assuming the API returns the data directly
    } catch (error) {
        console.error('Error fetching Thamso:', error.message);
        throw new Error('Failed to fetch Thamso.');
    }
};

const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
};

const importStudents = async (filePath, thamso) => {
    const students = [];
    const errors = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                const age = calculateAge(row.NgaySinh);

                if (age < thamso.TuoiHocSinhToiThieu || age > thamso.TuoiHocSinhToiDa) {
                    errors.push({
                        student: row,
                        error: `Invalid age (${age} years). Must be between ${thamso.TuoiHocSinhToiThieu} and ${thamso.TuoiHocSinhToiDa}.`,
                    });
                } else {
                    students.push({
                        TenHocSinh: row.TenHocSinh,
                        NgaySinh: row.NgaySinh,
                        GioiTinh: row.GioiTinh,
                        DiaChi: row.DiaChi,
                        Email: row.Email,
                    });
                }
            })
            .on('end', async () => {
                try {
                    // Insert only valid students
                    for (const student of students) {
                        await Student.create(student);
                    }
                    resolve({ students, errors });
                } catch (error) {
                    reject(error);
                }
            })
            .on('error', reject);
    });
};

const importStudentsFromExcel = async (filePath, thamso) => {
    const workbook = xlsx.readFile(filePath, {
        cellDates: true // Force dates to be read as Date objects
    });
    const sheetName = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
        raw: false,
        dateNF: 'yyyy-mm-dd' // Format dates consistently
    });

    const students = [];
    const errors = [];

    for (const row of rows) {
        // Convert Excel date serial number if needed
        let birthDate = row.NgaySinh;
        if (!isNaN(birthDate)) {
            birthDate = new Date((birthDate - 25569) * 86400 * 1000);
        }
        
        // Format date as YYYY-MM-DD
        const formattedDate = birthDate instanceof Date ? 
            birthDate.toISOString().split('T')[0] : 
            birthDate;

        const age = calculateAge(formattedDate);

        if (age < thamso.TuoiHocSinhToiThieu || age > thamso.TuoiHocSinhToiDa) {
            errors.push({
                row,
                error: `Invalid age (${age} years). Must be between ${thamso.TuoiHocSinhToiThieu} and ${thamso.TuoiHocSinhToiDa}.`
            });
        } else {
            students.push({
                TenHocSinh: row.TenHocSinh,
                NgaySinh: formattedDate,
                GioiTinh: row.GioiTinh,
                DiaChi: row.DiaChi,
                Email: row.Email
            });
        }
    }

    // Only attempt to create students if there are valid entries
    if (students.length > 0) {
        for (const student of students) {
            await Student.create(student);
        }
    }

    return { students, errors };
};

const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    try {
        // Fetch thamso data
        const thamso = await fetchThamso();

        // Determine file type and process accordingly
        const fileExtension = req.file.originalname.split('.').pop();
        let result;

        if (fileExtension === 'xlsx' || fileExtension === 'xls') {
            result = await importStudentsFromExcel(req.file.path, thamso);
        } else if (fileExtension === 'csv') {
            result = await importStudents(req.file.path, thamso);
        } else {
            throw new Error('Unsupported file type');
        }

        const { students, errors } = result;

        if (errors.length > 0) {
            return res.status(200).json({ message: 'Some rows could not be imported.', errors, students });
        }

        res.status(200).json({ message: 'File imported successfully.', students });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ message: 'Failed to import file.', error: error.message });
    } finally {
        fs.unlinkSync(req.file.path); // Clean up uploaded file
    }
};

module.exports = { upload, uploadFile };

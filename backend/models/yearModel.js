const db = require('../config/db'); // MySQL connection pool

const NamHoc = {
  // Fetch all school years
  getAll: async () => {
    const query = `
      SELECT 
        MaNamHoc, Nam1, Nam2
      FROM NAMHOC;
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  // Fetch a single school year by ID
  getById: async (id) => {
    const query = `
      SELECT 
        MaNamHoc, Nam1, Nam2
      FROM NAMHOC
      WHERE MaNamHoc = ?;
    `;
    const [rows] = await db.query(query, [id]);
    return rows[0];
  },
};

module.exports = NamHoc;

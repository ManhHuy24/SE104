const NamHoc = require('../models/yearModel');

const namHocController = {
  getAll: async (req, res) => {
    try {
      const years = await NamHoc.getAll();
      res.status(200).json(years);
    } catch (error) {
      console.error('Error fetching years:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getById: async (req, res) => {
    try {
      const id = req.params.id;
      const year = await NamHoc.getById(id);
      if (year) {
        res.status(200).json(year);
      } else {
        res.status(404).json({ error: 'Year not found' });
      }
    } catch (error) {
      console.error('Error fetching year:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = namHocController;

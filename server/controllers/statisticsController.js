const Student = require('../models/Student');

// Thống kê CPA theo lớp
exports.getCPAStatistics = async (req, res) => {
  try {
    const { className } = req.params;
    
    const cpaRanges = [
      { min: 3.6, max: 4.0, label: '3.6-4.0' },
      { min: 3.2, max: 3.59, label: '3.2-3.59' },
      { min: 2.5, max: 3.19, label: '2.5-3.19' },
      { min: 2.0, max: 2.49, label: '2.0-2.49' },
      { min: 0, max: 1.99, label: '0-1.99' }
    ];

    const statistics = await Promise.all(
      cpaRanges.map(async (range) => {
        const count = await Student.countDocuments({
          class: className,
          cpa: { $gte: range.min, $lte: range.max }
        });
        return {
          label: range.label,
          count: count
        };
      })
    );

    res.json(statistics);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Thống kê trạng thái theo lớp
exports.getStatusStatistics = async (req, res) => {
  try {
    const { className } = req.params;
    
    const statusCounts = await Student.aggregate([
      {
        $match: { class: className }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(statusCounts);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy danh sách lớp
exports.getClasses = async (req, res) => {
  try {
    const classes = await Student.distinct('class');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};
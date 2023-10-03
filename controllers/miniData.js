const { Exp } = require("../models/Expense");
const { Asset } = require("../models/Asset");
const { Manager } = require("../models/Manager");

const {
  splitDateAmount,
  splitMonthAmount,
} = require("../utils/DateAmountConv");

exports.getExpAsset = async (req, res) => {
  const manager = await Manager.findById({ _id: req.user._id });
  let start, end;
  if (req.query.from) {
    let thisDate = new Date(req.query.from);
    start = new Date(
      thisDate.getFullYear(),
      thisDate.getMonth(),
      thisDate.getDate(),
      0,
      0,
      0
    );
    if (req.query.to) {
      let nextDate = new Date(req.query.to);
      end = new Date(
        nextDate.getFullYear(),
        nextDate.getMonth(),
        nextDate.getDate(),
        23,
        59,
        59
      );
    } else {
      end = new Date(
        thisDate.getFullYear(),
        thisDate.getMonth(),
        thisDate.getDate(),
        23,
        59,
        59
      );
    }
  }

  const exp = await Exp.aggregate([
    {
      $match: {
        date: {
          $gte: start,
          $lt: end,
        },
        orgId: manager.org._id.toString(),
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$date",
            timezone: "Asia/Kolkata",
          },
        },
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        totalAmount: 1,
      },
    },
    {
      $sort: { date: 1 },
    },
  ]);

  const asset = await Asset.aggregate([
    {
      $match: {
        date: {
          $gte: start,
          $lt: end,
        },
        orgId: manager.org._id.toString(),
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$date",
            timezone: "Asia/Kolkata",
          },
        },
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        totalAmount: 1,
      },
    },
    {
      $sort: { date: 1 },
    },
  ]);

  res.json({ results: splitDateAmount(exp, asset, start, end) });
};

exports.getProfit = async (req, res) => {
  const manager = await Manager.findById({ _id: req.user._id });
  let start, end;
  if (req.query.from) {
    let thisDate = new Date(req.query.from);
    start = new Date(
      thisDate.getFullYear(),
      thisDate.getMonth(),
      thisDate.getDate(),
      0,
      0,
      0
    );
    if (req.query.to) {
      let nextDate = new Date(req.query.to);
      end = new Date(
        nextDate.getFullYear(),
        nextDate.getMonth(),
        nextDate.getDate(),
        23,
        59,
        59
      );
    } else {
      end = new Date(
        thisDate.getFullYear(),
        thisDate.getMonth(),
        thisDate.getDate(),
        23,
        59,
        59
      );
    }
  }

  const asset = await Asset.aggregate([
    {
      $match: {
        date: {
          $gte: start,
          $lt: end,
        },
        orgId: manager.org._id.toString(),
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m",
            date: "$date",
            timezone: "Asia/Kolkata",
          },
        },
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        totalAmount: 1,
      },
    },
    {
      $sort: { date: 1 },
    },
  ]);

  const exp = await Exp.aggregate([
    {
      $match: {
        orgId: manager.org._id.toString(),
        date: {
          $gte: start,
          $lt: end,
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m",
            date: "$date",
            timezone: "Asia/Kolkata",
          },
        },
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        totalAmount: 1,
      },
    },
    {
      $sort: { date: 1 },
    },
  ]);

  res.json({ results: splitMonthAmount(exp, asset, start, end) });
};

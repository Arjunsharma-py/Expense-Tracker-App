function formatDate(date) {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function formatMonthDate(date) {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month].join("-");
}

exports.splitDateAmount = (exp, asset, start, end) => {
  startDate = new Date(start);
  endDate = new Date(end);

  let dates = [];
  let expAmounts = [];
  let assetAmounts = [];

  if (!exp.length && !asset.length) return { dates, expAmounts, assetAmounts };

  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    let dateString = formatDate(d);
    let expObj = exp.find((obj) => obj.date === dateString);
    let assetObj = asset.find((obj) => obj.date === dateString);
    if (expObj || assetObj) {
      dates.push(new Date(dateString).getDate());
      expAmounts.push(expObj ? expObj.totalAmount : 0);
      assetAmounts.push(assetObj ? assetObj.totalAmount : 0);
    }
  }
  return { dates, expAmounts, assetAmounts };
};

exports.splitMonthAmount = (exp, asset, start, end) => {
  startDate = new Date(start);
  endDate = new Date(end);

  let dates = [];
  let profits = [];
  let profitPerc = [];

  for (let d = startDate; d <= endDate; d.setMonth(d.getMonth() + 1)) {
    let dateString = formatMonthDate(d);

    let expObj = exp.find((obj) => obj.date === dateString);
    let assetObj = asset.find((obj) => obj.date === dateString);

    if (expObj || assetObj) {
      dates.push(
        new Date(dateString).toLocaleString("en-US", { month: "short" })
      );
      profits.push(
        (assetObj ? assetObj.totalAmount : 0) -
          (expObj ? expObj.totalAmount : 0)
      );
      profitPerc.push(
        (((assetObj ? assetObj.totalAmount : 0) -
          (expObj ? expObj.totalAmount : 0)) /
          (expObj ? expObj.totalAmount : 1)) *
          100
      );
    }
  }
  return { dates, profits, profitPerc };
};

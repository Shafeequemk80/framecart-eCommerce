const Order = require("../model/orderModel");
const moment = require("moment");
const bctypt = require("bcrypt");
const User = require("../model/userModel");
const Category = require("../model/categoryModel");
const Products = require("../model/productsModel");
const nodemailer = require("nodemailer");
const config = require("../config/config");
const randomstring = require("randomstring");
const otpGenerator = require("otp-generator");
const Mail = require("nodemailer/lib/mailer");
const user_route = require("../routes/userRoute");
const { token } = require("morgan");
const Offer = require("../model/offerModel");
const excelJs = require("exceljs");
const loaddashboard = async (req, res) => {
  try {
    const paymenttypevalue = req.query.filter || "weekly";

    let filteredOrders, formattedLabels, dailySales, dailyOrderCounts;

    if (paymenttypevalue === "weekly") {
      ({ filteredOrders, formattedLabels, dailySales, dailyOrderCounts } =
        await fetchWeeklyData());
    } else if (paymenttypevalue === "monthly") {
      ({ filteredOrders, formattedLabels, dailySales, dailyOrderCounts } =
        await fetchMonthlyData());
    } else if (paymenttypevalue === "yearly") {
      ({ filteredOrders, formattedLabels, dailySales, dailyOrderCounts } =
        await fetchYearlyData());
    }

    const totalSalesForMonth = calculateTotalSales(filteredOrders);
    const totalOrderCountForMonth = filteredOrders.length;

    const recentOrders = await Order.find()
      .limit(5)
      .sort({ orderDate: -1 })
      .populate("user")
      .exec();
    const orderData = await Order.find();
    const ProductData = await Products.find();
    const CategoryData = await Category.find();
    const userData = await User.find();
    const totalData = {
      orderData: orderData,
      ProductData: ProductData,
      CategoryData: CategoryData,
      UserData: userData,
    };

    const paymentCounts = countPaymentMethods(filteredOrders);

    const data = {
      totalSales: {
        labels: formattedLabels,
        data: dailySales.map((day) => day.totalSales),
      },
      paymentCounts: paymentCounts,
      totalSaleForMonth: totalSalesForMonth,
      totalOrderCountForMonth: totalOrderCountForMonth,
      dailyOrderCounts: dailyOrderCounts,
    };

    res.render("dashboard", { data, recentOrders, moment, totalData });
  } catch (error) {
    res.render("500");
  }
};
const fetchWeeklyData = async () => {
  const currentDate = new Date();
  const firstDayOfWeek = new Date(currentDate);
  firstDayOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  firstDayOfWeek.setHours(0, 0, 0, 0); // Set to the beginning of the day

  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
  lastDayOfWeek.setHours(23, 59, 59, 999); // Set to the end of the day

  const weeklyOrders = await Order.find({
    orderDate: {
      $gte: firstDayOfWeek,
      $lte: lastDayOfWeek,
    },
  });

  const dailyOrderCounts = Array.from({ length: 7 }, (_, i) => 0);

  weeklyOrders.forEach((order) => {
    const orderDay = order.orderDate.getDay();
    dailyOrderCounts[orderDay] += 1;
  });

  const dailySales = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(
      firstDayOfWeek.getFullYear(),
      firstDayOfWeek.getMonth(),
      firstDayOfWeek.getDate() + i
    ),
    totalSales: 0,
  }));

  weeklyOrders.forEach((order) => {
    const orderDay = order.orderDate.getDay();
    dailySales[orderDay].totalSales += order.amount;
  });

  const formattedLabels = dailySales.map((day) =>
    moment(day.date).format("ddd D")
  );

  return {
    filteredOrders: weeklyOrders,
    formattedLabels,
    dailySales,
    dailyOrderCounts,
  };
};

const fetchMonthlyData = async () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Months are zero-based

  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
  firstDayOfMonth.setHours(0, 0, 0, 0); // Set to the beginning of the day
  const lastDayOfMonth = new Date(currentYear, currentMonth, 0);
  lastDayOfMonth.setHours(23, 59, 59, 999);

  const monthlyOrders = await Order.find({
    orderDate: {
      $gte: firstDayOfMonth,
      $lte: lastDayOfMonth,
    },
  });

  const dailyOrderCounts = Array.from(
    { length: lastDayOfMonth.getDate() },
    (_, i) => 0
  );

  monthlyOrders.forEach((order) => {
    const orderDay = order.orderDate.getDate();
    dailyOrderCounts[orderDay - 1] += 1;
  });

  const dailySales = Array.from(
    { length: lastDayOfMonth.getDate() },
    (_, i) => ({
      date: new Date(currentYear, currentMonth - 1, i + 1),
      totalSales: 0,
    })
  );

  monthlyOrders.forEach((order) => {
    const orderDay = order.orderDate.getDate();
    dailySales[orderDay - 1].totalSales += order.amount;
  });

  const formattedLabels = dailySales.map((day) =>
    moment(day.date).format("MMM D")
  );

  return {
    filteredOrders: monthlyOrders,
    formattedLabels,
    dailySales,
    dailyOrderCounts,
  };
};
const fetchYearlyData = async () => {
  const currentYear = new Date().getFullYear();

  const firstDayOfYear = new Date(currentYear, 0, 1);
  firstDayOfYear.setHours(0, 0, 0, 0); // Set to the beginning of the day
  const lastDayOfYear = new Date(currentYear, 11, 31);
  lastDayOfYear.setHours(23, 59, 59, 999);
  const yearlyOrders = await Order.find({
    orderDate: {
      $gte: firstDayOfYear,
      $lte: lastDayOfYear,
    },
  });

  const monthlyOrderCounts = Array.from({ length: 12 }, () => 0);

  yearlyOrders.forEach((order) => {
    const orderMonth = order.orderDate.getMonth();
    monthlyOrderCounts[orderMonth] += 1;
  });

  const dailySales = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    totalSales: 0,
    orderCount: 0,
  }));

  yearlyOrders.forEach((order) => {
    const orderMonth = order.orderDate.getMonth();
    dailySales[orderMonth].orderCount += 1;
    dailySales[orderMonth].totalSales += order.amount;
  });

  const formattedLabels = dailySales.map((month) =>
    moment(`${currentYear}-${month.month}`, "YYYY-M").format("MMM")
  );

  return {
    filteredOrders: yearlyOrders,
    formattedLabels,
    dailySales,
    dailyOrderCounts: monthlyOrderCounts,
  };
};

const calculateTotalSales = (orders) => {
  return orders.reduce((total, order) => total + order.amount, 0);
};

const countPaymentMethods = (orders) => {
  const paymentCounts = {
    online: 0,
    wallet: 0,
    cashOnDelivery: 0,
  };

  orders.forEach((order) => {
    const paymentMethod = order.paymentMethod.toLowerCase();
    if (paymentMethod === "online") {
      paymentCounts.online += 1;
    } else if (paymentMethod === "wallet") {
      paymentCounts.wallet += 1;
    } else {
      paymentCounts.cashOnDelivery += 1;
    }
  });

  return paymentCounts;
};

const loadsales = async (req, res) => {
  try {
    const paymenttypevalue = req.query.filter || "weekly";
    const Datestart = new Date(
      req.query.startDate || new Date().setDate(new Date().getDate() - 30)
    );
    Datestart.setHours(0, 0, 0, 0); // Set to the beginning of the day
    const endDate = new Date(req.query.endDate || Date.now());
    endDate.setHours(23, 59, 59, 999);

    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    let limit = 5;

    let query = {};
    const action = req.query.action || "all";
    if (action === "all") {
      query = {
        orderDate: {
          $gte: Datestart,
          $lte: endDate,
        },
      };
    } else {
      query = {
        orderDate: {
          $gte: Datestart,
          $lte: endDate,
        },
        "products.orderStatus": action,
      };
    }

    const orders = await Order.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("user")
      .sort({ orderDate: -1 })
      .exec();

    const count = await Order.find({
      orderDate: {
        $gte: Datestart,
        $lte: endDate,
      },
    }).countDocuments();

    const ProductData = await Products.find();
    const CategoryData = await Category.find();
    const userData = await User.find();
    const totalData = {
      ProductData: ProductData,
      CategoryData: CategoryData,
      UserData: userData,
    };
    // Get the current month and year
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-based

    // Calculate the first and last day of the current month
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth, 0);

    // Fetch orders for the current month
    const monthlyOrders = await Order.find({
      orderDate: {
        $gte: firstDayOfMonth,
        $lte: lastDayOfMonth,
      },
    });

    // Calculate total sales and order count for the month
    const totalSalesForMonth = monthlyOrders.reduce(
      (total, order) => total + order.amount,
      0
    );
    const totalOrderCountForMonth = monthlyOrders.length;

    // Create an array to store daily order counts
    const dailyOrderCounts = Array.from(
      { length: lastDayOfMonth.getDate() },
      (_, i) => 0
    );

    // Calculate daily order counts
    monthlyOrders.forEach((order) => {
      const orderDay = order.orderDate.getDate();
      dailyOrderCounts[orderDay - 1] += 1;
    });

    // Create an array to store daily sales
    const dailySales = Array.from(
      { length: lastDayOfMonth.getDate() },
      (_, i) => ({
        date: new Date(currentYear, currentMonth - 1, i + 1),
        totalSales: 0,
      })
    );

    // Calculate daily sales
    monthlyOrders.forEach((order) => {
      const orderDay = order.orderDate.getDate();
      dailySales[orderDay - 1].totalSales += order.amount;
    });

    // Format labels for the total sales chart
    const formattedLabels = dailySales.map(
      (day) => day.date.getDate() + " " + moment(day.date).format("MMM")
    );

    // Calculate the date from a specified number of days ago
    const daysAgo = paymenttypevalue;
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - daysAgo);

    // Fetch orders within the specified date range

    const data = {
      totalSales: {
        labels: formattedLabels,
        data: dailySales.map((day) => day.totalSales),
      },
      totalSaleForMonth: totalSalesForMonth,
      totalOrderCountForMonth: totalOrderCountForMonth,
      dailyOrderCounts: dailyOrderCounts,
    };

    const newUsers = await User.find().limit(5).sort({ _id: -1 });
    const result = await Order.aggregate([
      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: "$products.product",
          totalOrders: { $sum: "$products.count" },
          totalQuantity: { $sum: "$products.count" }, // New: Calculate total quantity
        },
      },
      {
        $sort: {
          totalOrders: -1,
        },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "mostOrderedProducts",
        },
      },
      {
        $addFields: {
          mostOrderedProduct: { $arrayElemAt: ["$mostOrderedProducts", 0] },
        },
      },
      {
        $project: {
          _id: 0,
          product: "$_id",
          totalOrders: 1,
          totalQuantity: 1,
          mostOrderedProduct: 1,
        },
      },
    ]);

    const mostOrderedProducts = result.map((item) => item);

    res.render("salesreport", {
      data,
      totalData,
      order: orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      previospage: page - 1,
      nextpage: parseInt(page) + 1,
      count: count,
      moment: moment,
      newUsers,
      mostOrderedProducts: mostOrderedProducts,
      startDate: Datestart,
      endDate: endDate,
    });
  } catch (error) {
    res.render("500");
  }
};

const loadchart = async (req, res) => {
  const userData = await User.find();
  // Get the current month and year
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Months are zero-based

  // Calculate the first and last day of the current month
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth, 0);

  let query = {};
  const action = req.query.action || "all";
  if (action === "all") {
    query = {
      orderDate: {
        $gte: firstDayOfMonth,
        $lte: lastDayOfMonth,
      },
    };
  } else {
    query = {
      orderDate: {
        $gte: firstDayOfMonth,
        $lte: lastDayOfMonth,
      },
      "products.statusLevel": action,
    };
  }

  // Fetch orders for the current month
  const monthlyOrders = await Order.find(query);

  // Create an array to store daily sales
  const dailySales = Array.from({ length: lastDayOfMonth.getDate() }, () => 0);

  // Calculate daily sales
  monthlyOrders.forEach((order) => {
    const orderDay = order.orderDate.getDate();
    dailySales[orderDay - 1] += order.amount;
  });
  const formattedMonth = moment()
    .month(currentMonth - 1)
    .format("MMM");

  const totalSales = {
    labels: Array.from(
      { length: lastDayOfMonth.getDate() },
      (_, i) => `${i + 1} ${formattedMonth}`
    ),
    data: dailySales,
  };

  // Calculate total sale
  const totalSaleResult = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSale: { $sum: "$amount" },
      },
    },
  ]);

  // Extract total sale from the result
  const totalSale =
    totalSaleResult.length > 0 ? totalSaleResult[0].totalSale : 0;
  // Render the dashboard view with total sale
  res.json({ totalSale, totalSales });

  try {
  } catch (error) {
    res.render("500");
  }
};

const exportexcel = async (req, res) => {
  try {
    const Datestart = new Date(
      req.query.startDate || new Date().setDate(new Date().getDate() - 30)
    );
    Datestart.setHours(0, 0, 0, 0); // Set to the beginning of the day
    const endDate = new Date(req.query.endDate || Date.now());
    endDate.setHours(23, 59, 59, 999);

    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("Sales report");

    let query = {};
    const action = req.query.action || "all";
    if (action === "all") {
      query = {
        orderDate: {
          $gte: Datestart,
          $lte: endDate,
        },
      };
    } else {
      query = {
        orderDate: {
          $gte: Datestart,
          $lte: endDate,
        },
        paymentMethod: action,
      };
    }

    worksheet.columns = [
      { header: "S No", key: "s_no" },
      { header: "Order Id", key: "orderId" },
      { header: "User Name", key: "user.firstname" },
      { header: "User Mobile", key: "user.mobile" },
      { header: "User email", key: "user.email" },
      { header: "Product Name", key: "products.product.name", width: 20 }, // Assuming there's a 'name' property in your product model
      { header: "Product Count", key: "products.count" },
      { header: "Product Total Price", key: "products.totalprice" },

      { header: "Order Status", key: "products.orderStatus" },
      { header: "City", key: "address.city" },
      { header: "State", key: "address.state" },
      { header: "Payment Method", key: "paymentMethod" },
      { header: "Order Date", key: "orderDate" },
      { header: "Order Time", key: "orderTime" },
      { header: "Delivery Date", key: "deliveryDate" },
      { header: "Amount", key: "amount" },
    ];

    let count = 1;
    const orderData = await Order.find(query)
      .populate("user")
      .populate("products.product");

    orderData.forEach((order) => {
      const formattedOrder = {
        s_no: count,
        orderId: order.orderId,
        "user.firstname": order.user.firstname,
        "user.mobile": order.user.mobile,
        "user.email": order.user.email,
        "products.product.name": order.products
          .map((p) => p.product.productname)
          .join("\n"),
        "products.count": order.products.map((p) => p.count).join("\n"),
        "products.totalprice": order.products
          .map((p) => p.totalprice)
          .join("\n"),
        "products.paymentStatus": order.products
          .map((p) => p.paymentStatus)
          .join("\n"),
        "products.orderStatus": order.products
          .map((p) => p.orderStatus)
          .join("\n"),
        "address.city": order.address.city,
        "address.state": order.address.state,
        paymentMethod: order.paymentMethod,
        orderDate: order.orderDate,
        orderTime: order.orderTime,
        deliveryDate: order.deliveryDate,
        amount: order.amount,
      };

      worksheet.addRow(formattedOrder);
      count++;
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=SalesReport.xlsx`
    );

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    res.render("500");
  }
};

const exportpdf = async (req, res) => {
  try {
    const Datestart = new Date(
      req.query.startDate || new Date().setDate(new Date().getDate() - 30)
    );
    Datestart.setHours(0, 0, 0, 0); // Set to the beginning of the day
    const endDate = new Date(req.query.endDate || Date.now());
    endDate.setHours(23, 59, 59, 999);

    let query = {};
    const action = req.query.action || "all";
    if (action === "all") {
      query = {
        orderDate: {
          $gte: Datestart,
          $lte: endDate,
        },
      };
    } else {
      query = {
        orderDate: {
          $gte: Datestart,
          $lte: endDate,
        },
        paymentMethod: action,
      };
    }

    const orderData = await Order.find(query)
      .populate("user")
      .populate("products.product");

    let totalamount = 0;

    orderData.forEach((product) => {
      totalamount += product.amount;
    });
    res.render("exportpdf", { orderData, moment, totalamount });
  } catch (error) {
    res.render("500");
  }
};

module.exports = {
  loadsales,
  loaddashboard,
  loadchart,
  exportexcel,
  exportpdf,
};

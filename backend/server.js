

// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// // Import routes
// const signupRoute = require("./api/signupRoute");
// const loginRoute = require("./api/loginRoute");
// const newConsPostRoute = require("./api/newConsPostRoute");
// const diaryAmountPostRoute = require("./api/diaryAmountPostRoute");
// const getTotalDiaryCollectionRoute = require('./api/getTotalDiaryCollectionRoute');
// const consListGetRoute = require('./api/consListGetRoute');
// const deleteEntryRoute = require('./api/deleteEntryRoute');
// const updateConsumerRoute = require('./api/updateConsumerRoute');
// const dailyReportRoute = require('./api/dailyReportRoute');
// const deleteInstallmentRoute = require('./api/deleteInstallmentRoute');
// const getConsumerNumberRoute = require('./api/getConsumerNumberRoute');
// const paymentRoute = require('./api/paymentRoute');
// const getConsumerNameRoute = require('./api/getConsumerNameRoute');
// const getConsumerDetailsRoute = require('./api/getConsumerDetailsRoute');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ Connected to MongoDB"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // Routes with correct base paths
// app.use("/api/signup", signupRoute);
// app.use("/api/login", loginRoute);
// app.use("/api/new-consumer", newConsPostRoute);
// app.use("/api/diary-amount", diaryAmountPostRoute);
// app.use("/api/getTotalDiaryCollection", getTotalDiaryCollectionRoute);
// app.use("/api/consumer-list", consListGetRoute);
// app.use("/api/delete-entry", deleteEntryRoute);
// app.use("/api/update-consumer", updateConsumerRoute);
// app.use("/api/daily-report", dailyReportRoute);
// app.use("/api/delete-installment", deleteInstallmentRoute);
// app.use("/api/consumer-number", getConsumerNumberRoute);
// app.use("/api/payment", paymentRoute);
// app.use("/api/consumer-name", getConsumerNameRoute);
// app.use("/api/consumer-details", getConsumerDetailsRoute); // <-- here is your diaryNumber lookup

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
// });


require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import routes
const signupRoute = require("./api/signupRoute");
const loginRoute = require("./api/loginRoute");
const newConsPostRoute = require("./api/newConsPostRoute");
const diaryAmountPostRoute = require("./api/diaryAmountPostRoute");
const getTotalDiaryCollectionRoute = require('./api/getTotalDiaryCollectionRoute');
const consListGetRoute = require('./api/consListGetRoute');
const deleteEntryRoute = require('./api/deleteEntryRoute');
const updateConsumerRoute = require('./api/updateConsumerRoute');
const dailyReportRoute = require('./api/dailyReportRoute');
const deleteInstallmentRoute = require('./api/deleteInstallmentRoute');
const getConsumerNumberRoute = require('./api/getConsumerNumberRoute');
const paymentRoute = require('./api/paymentRoute');
const getConsumerNameRoute = require('./api/getConsumerNameRoute');
const getConsumerDetailsRoute = require('./api/getConsumerDetailsRoute');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Test route to confirm server is running
app.get("/", (req, res) => {
  res.send("✅ API is up and running!");
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/signup", signupRoute);
app.use("/api/login", loginRoute);
app.use("/api/new-consumer", newConsPostRoute);
app.use("/api/diary-amount", diaryAmountPostRoute);
app.use("/api/getTotalDiaryCollection", getTotalDiaryCollectionRoute);
app.use("/api/consumer-list", consListGetRoute);
app.use("/api/delete-entry", deleteEntryRoute);
app.use("/api/update-consumer", updateConsumerRoute);
app.use("/api/daily-report", dailyReportRoute);
app.use("/api/delete-installment", deleteInstallmentRoute);
app.use("/api/consumer-number", getConsumerNumberRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/consumer-name", getConsumerNameRoute);
app.use("/api/consumer-details", getConsumerDetailsRoute);

// Start server
const PORT = process.env.PORT || 8081;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});

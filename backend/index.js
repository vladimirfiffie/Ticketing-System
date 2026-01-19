require("dotenv").config();
const express = require("express")
const ticketRoutes = require("./routes/tickets")

const app = express();
app.use(express.json());
app.use("/api/tickets", ticketRoutes);

app.listen(process.env.PORT || 3000, () => console.log("Server running on port 3000"));
import "dotenv/config";
import express from "express";
import cors from "cors";
import { orderRoute } from "@/modules/order/order.route";
import { authRoute } from "@/modules/auth/auth.route";
import { userRoute } from "@/modules/user/user.route";
import { productRoute } from "@/modules/product/product.route";
import { paymentRoute } from "@/modules/payment/payment.route";

const app = express();

app.use(cors({ origin: process.env["CLIENT_URL"] ?? "http://localhost:5173" }));
app.use(express.json());

// API versioning
const v1 = express.Router();
v1.use("/auth", authRoute);
v1.use("/users", userRoute);
v1.use("/products", productRoute);
v1.use("/orders", orderRoute);
v1.use("/payments", paymentRoute);

app.use("/api/v1", v1);

export default app;

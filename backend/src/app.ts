import express from "express";
import productRoute from "./routes/product";
import cors from "cors";
import path from 'path'

const app = express();




// middleware to parse incoming request in JSON format
app.use(express.json());
app.use(cors());


app.use("/api/v1/products", productRoute);

app.use(express.static(path.join(__dirname,"../../frontend/dist/frontend/browser")))


app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname,"../../frontend/dist/frontend/browser/index.html"))
})


export default app;

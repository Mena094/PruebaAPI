import express from "express"//importando la libreria express.
import dotenv from "dotenv"//importando la libreria dotenv.
import usuarioRoute from "./routes/Usuario.routes.js"
const app  = express(); //ejecutando la libreria.
dotenv.config();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.use("/api", usuarioRoute)//

app.listen(PORT, ()=> {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});


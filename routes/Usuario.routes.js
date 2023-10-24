import fs from "fs";
import path from "path";
import { Router } from "express";

const router = Router();
const usuariosFile = path.join(process.cwd(), 'data', 'Usuario.json');


// Ruta para autenticar un usuario por nombre de usuario y contraseña
router.post('/login', (req, res) => {
    const { nameUser, password } = req.body;
    const usuarios = ObtenerUsuarios(); // Debes definir la función ObtenerUsuarios() para cargar los datos de Usuario.json

    // Buscar el usuario por nombre de usuario
    const usuario = usuarios.find(user => user.nameUser === nameUser);

    if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña
    if (usuario.password === password) {
        return res.json({usuario });
    } else {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
    }
});

// Ruta para crear un nuevo usuario y validar el nombre de usuario
router.post('/create', (req, res) => {
    const { nameUser, password, Nombre, Apellido, Edad } = req.body;
    const usuarios = ObtenerUsuarios(); // Debes definir la función ObtenerUsuarios() para cargar los datos de Usuario.json

    // Verificar si el nombre de usuario ya está en uso
    const usuarioExistente = usuarios.find(user => user.nameUser === nameUser);
    if (usuarioExistente) {
        return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    // Si el nombre de usuario no está en uso, crea un nuevo usuario
    const nuevoUsuario = {
        nameUser,
        password,
        Nombre,
        Apellido,
        Edad
    };

    // Agregar el nuevo usuario a la lista de usuarios
    usuarios.push(nuevoUsuario);

    // Guardar la lista actualizada de usuarios en el archivo JSON
    fs.writeFileSync(usuariosFile, JSON.stringify(usuarios, null, 2));

    return res.json({ message: 'Usuario creado exitosamente', usuario: nuevoUsuario });
});

// Función para cargar los datos de usuarios desde Usuario.json
function ObtenerUsuarios() {
    const usuariosFile = path.join(process.cwd(), 'data', 'Usuario.json');
    const contenido = fs.readFileSync(usuariosFile, 'UTF-8');
    return JSON.parse(contenido);
}

export default router;

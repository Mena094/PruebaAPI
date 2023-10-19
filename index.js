import express from "express"
import fs from "fs"
import dotenv from "dotenv"
const app  = express();
dotenv.config();
const PORT = process.env.PORT || 3000;
app.use(express.json());
//Ruta Get para obtener todos los usuarios.
app.get('/Persona', (req, res)=> {
    const personas = ObtenerPersonas();
    res.json(personas);
});

//Ruta POST para Guardar nuevas personas
app.post('/Persona', (req, res)=>{
    const nuevo = req.body;
    GuardarPersona(nuevo);
    res.status(200).json({ message: 'La persona se guardo exitosamente' });
});

function ObtenerPersonas() {
    const contenido = fs.readFileSync('Persona.json','UTF-8');
    return JSON.parse(contenido);
}

function GuardarPersona(pPersona){
    const contenidoActual = ObtenerPersonas();
    const nuevaPersona = [...contenidoActual, pPersona];
    fs.writeFileSync('Persona.json', JSON.stringify(nuevaPersona,null,2));
}
// Ruta PUT para actualizar una persona por su ID
app.put('/Persona/:Id', (req, res) => {
    const personaId = Number(req.params.Id);
    console.table({id: req.params.Id, number: personaId})
    const personas = ObtenerPersonas(); // Se debe definir la función ObtenerPersonas() para cargar los datos de Persona.json

    // Buscar la persona con el ID proporcionado en el cuerpo de la solicitud
    const personaIndex = personas.findIndex(persona => persona.Id === personaId);

    if (personaIndex <= 0) {
        // Si no se encontró la persona, responder con un error 404
        return res.status(404).json({ message: 'La persona no se encontró' });
    }

    // Actualizar la información de la persona con los datos de la solicitud
    const personaActualizada = req.body;
    personas[personaIndex] = { ...personas[personaIndex], ...personaActualizada };

    // Guardar el arreglo actualizado en el archivo JSON
    fs.writeFileSync('Persona.json', JSON.stringify(personas, null, 2));

    res.json({ message: 'Persona actualizada exitosamente' });
});

// Ruta DELETE para eliminar una persona por su ID
app.delete('/Persona/:Id', (req, res) => {
    const personaId = parseInt(req.params.Id);
    const personas = ObtenerPersonas(); // Debes definir la función ObtenerPersonas() para cargar los datos de Persona.json
    // Buscar la persona con el ID proporcionado en la ruta
    const personaIndex = personas.findIndex(persona => persona.Id === personaId);
    if (personaIndex <= 0) {
    // Si no se encontró la persona, responder con un error 404
        return res.status(404).json({ message: 'La persona no se encontró' });
    }
    // Eliminar la persona del arreglo
    const personaEliminada = personas.splice(personaIndex, 1);

    // Guardar el arreglo actualizado en el archivo JSON
    fs.writeFileSync('Persona.json', JSON.stringify(personas, null, 2));

    res.json({ message: 'Persona eliminada exitosamente', persona: personaEliminada });
});

app.listen(PORT, ()=> {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});


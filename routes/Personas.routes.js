import fs from "fs"
import path from "path"
import { Router } from "express"; //Importar una funcion de la libreria Express
const router = Router();//ejecutar la funcion Router

//Identificacion de ruta raiz del proyecto 
const parsonasfile = path.join(process.cwd(), "data", "Persona.json");

//Ruta Get para obtener todos los usuarios.
router.get('/', (req, res)=> {
    const personas = ObtenerPersonas();
    res.json(personas);
});

//Ruta POST para Guardar nuevas personas
router.post('/', (req, res)=>{
    const nuevo = req.body;
    GuardarPersona(nuevo);
    res.status(200).json({ message: 'La persona se guardo exitosamente' });
});

function ObtenerPersonas() {
    const contenido = fs.readFileSync(parsonasfile,'UTF-8');
    return JSON.parse(contenido);
}

function GuardarPersona(pPersona){
    const contenidoActual = ObtenerPersonas();
    const nuevaPersona = [...contenidoActual, pPersona];
    fs.writeFileSync(parsonasfile, JSON.stringify(nuevaPersona,null,2));
}
// Ruta PUT para actualizar una persona por su ID
router.put('/:Id', (req, res) => {
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
    fs.writeFileSync(parsonasfile, JSON.stringify(personas, null, 2));

    res.json({ message: 'Persona actualizada exitosamente' });
});

// Ruta DELETE para eliminar una persona por su ID
router.delete('/:Id', (req, res) => {
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
    fs.writeFileSync(parsonasfile, JSON.stringify(personas, null, 2));

    res.json({ message: 'Persona eliminada exitosamente', persona: personaEliminada });
});
export default router;
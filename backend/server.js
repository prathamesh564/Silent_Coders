import express from 'express';
const app = express();
const port = 3000;
app.use(express.json());
const Cars=[
    {id:1,name: 'Toyota',model:'Camry', year: 2020},
    {id:2,name:'Honda',model:'Civic', year: 2019},
    {id:3,name: 'Ford',model:'Mustang', year: 2021}
]
app.get('/', (req, res) => {
    res.send("Hello cars");
})
app.get('/cars/:id', (req, res) => {
    res.json(Cars);
})
app.post('/cars', (req, res) => {
    const newCar = req.body;
    Cars.push(newCar);
    res.status(201).json(newCar);
})
app.delete('/cars/:id', (req, res) => {
    const carId = parseInt(req.params.id);
    const carIndex = Cars.findIndex(car => car.id === carId);
    if (carIndex !== -1) {
        Cars.splice(carIndex, 1);
        res.json({message: `Car with id ${req.params.id} deleted`});
    } else {
        res.status(404).json({message: `Car with id ${req.params.id} not found`});
    }
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
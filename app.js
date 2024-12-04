const pg = require("pg");
const port = 3000;
const env = require("./env.json");
const Pool = pg.Pool;
const pool = new Pool(env);
const express = require("express");
const app = express();
app.use(express.json());
const hostname = "localhost";
module.exports = app;

app.get("/vehicle", (req, res) => {
    pool.query("SELECT * FROM Vehicle")
    .then(result => {
        const vehicles = result.rows.map(row => ({
            ...row,
            horse_power: parseInt(row.horse_power, 10),
            model_year: parseInt(row.model_year, 10),
            purchase_price: parseFloat(row.purchase_price),
        }));
        return res.status(200).json(vehicles);
    })
    .catch(error => {
        res.status(500).json({error : error.message})
    });
});


app.get("/vehicle/:id", (req,res) => {
    const {id} = req.params;
    console.log("vin id: ", id);
    pool.query("SELECT * FROM Vehicle WHERE vin = $1", [id])
    .then(result =>{
        if (result.rows.length === 0){
            return res.status(404).json({message : "No vehicle found with vin id"});
        }
        const vehicles = result.rows.map(row => ({
            ...row,
            horse_power: parseInt(row.horse_power, 10),
            model_year: parseInt(row.model_year, 10),
            purchase_price: parseFloat(row.purchase_price),
        }));
        return res.status(200).json(vehicles)
    })
    .catch(error => {
        res.status(500).json({message : error.message})
    });
 
});

app.put("/vehicle/:id", async (req, res) => {
    const {id} = req.params;
    console.log("vin id: ", id);

    try{
        await validateVehicleBody(req.body)
    }
    catch(error){
        return res.status(422).json({"error" : error.message})
    };

    let {manufacturer_name, description, horse_power, model_name, model_year, purchase_price, fuel_type} = req.body;
    pool.query(
        'UPDATE Vehicle SET manufacturer_name = $1, description = $2, horse_power = $3, model_name = $4, model_year = $5, purchase_price = $6, fuel_type = $7 WHERE vin = $8 RETURNING *',
        [manufacturer_name, description, horse_power, model_name, model_year, purchase_price, fuel_type, id]
    ).then(result => {
        if(result.rows.length === 0){
            return res.status(422).json({message : "Could not find and update vehicle with vin"});
        }
        const vehicles = result.rows.map(row => ({
            ...row,
            horse_power: parseInt(row.horse_power, 10),
            model_year: parseInt(row.model_year, 10),
            purchase_price: parseFloat(row.purchase_price),
        }));
         return res.status(200).json(vehicles)
    })
    .catch(error => {
        return res.status(500).json({message : error.message});
    });
});

app.delete("/vehicle/:id", (req,res) => {
    const {id} = req.params;
    console.log("vin id: ", id);
    pool.query(
        'DELETE FROM Vehicle WHERE vin = $1', [id]
    )
    .then(result => {
        if(result.rowCount === 0){
            return res.status(404).json({message : "Could not find and delete vehicle with vin"});
        }
        return res.status(204).send()
    })
    .catch(error =>{
        return res.status(500).json({message : error.message})
    });
});


async function validateVehicleBody(body){
    let {manufacturer_name, description, horse_power, model_name, model_year, purchase_price, fuel_type} = body;
    
    if (!manufacturer_name || !description || !horse_power || !model_name || !model_year || !purchase_price || !fuel_type)
    {
        throw { 
            status : 422, 
            message : "Missing required fields"
        }
    }

    if (
        typeof manufacturer_name !== "string" ||
        typeof model_name !== "string" ||
        typeof fuel_type !== "string" ||
        typeof horse_power !== "number" ||
        typeof model_year !== "number" ||
        typeof purchase_price !== "number"
    ){
        throw { 
            status : 422, 
            message : "Malformed attributes"
        }

    }

    if (model_year < 1886 || model_year > 2024) {
        throw {
            status: 422,
            message: `model_year must be between 1886 and 2024`,
        };
    }

    if (purchase_price <= 0) {
        throw {
            status: 422,
            message: "purchase_price must be a positive number",
        };
    }
    
}

app.post("/vehicle", async (req,res) => {
    try{
        await validateVehicleBody(req.body)
    }
    catch(error){
        return res.status(422).json({"error" : error.message})
    };

    let {manufacturer_name, description, horse_power, model_name, model_year, purchase_price, fuel_type} = req.body;
    pool.query("INSERT INTO Vehicle (manufacturer_name, description, horse_power, model_name, model_year, purchase_price, fuel_type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [
    manufacturer_name,
    description,
    horse_power,
    model_name,
    model_year,
    purchase_price,
    fuel_type])
    .then(result => {
        const vehicles = result.rows.map(row => ({
            ...row,
            horse_power: parseInt(row.horse_power, 10),
            model_year: parseInt(row.model_year, 10),
            purchase_price: parseFloat(row.purchase_price),
        }));
        return res.status(201).json(vehicles); 
    })
    .catch(error => {
        return res.status(500).json({"error" : error});
    });
    
})

app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ error: "Invalid JSON format" });
    }
    next(err);
});


app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
  });
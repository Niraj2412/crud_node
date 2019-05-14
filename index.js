const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin@1234',
    database: 'employeedb'
   
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});

app.listen(3000, () => console.log('Express server is runnig at port no : 3000'));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
    
  });
//Get all employees
app.get('/employees', (req, res) => {
    
    mysqlConnection.query('SELECT * FROM Employee', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

// app.get('/employees/:id', (req, res) => {
//     mysqlConnection.query('SELECT * FROM Employee WHERE EmpID = ?', [req.params.id], (err, rows, fields) => {
//         if (!err)
//             res.send(rows);
//         else
//             console.log(err);
//     })
// });

app.delete('/employees/:id', (req, res) => {
    
    mysqlConnection.query('DELETE FROM Employee WHERE EmpID = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
           // console.log(res.send(rows))
        
            res.send(JSON.parse(JSON.stringify(rows)));
        else
            console.log(err);
    })
});


app.post('/create_data',(req, res) => {


var user = {
     EmpID:req.body.EmpID,
     Name:req.body.Name,
 
     EmpCode:req.body.EmpCode,
     Salary: req.body.Salary,
     Email:req.body.Email,
     phone:req.body.phone,
}
  
   mysqlConnection.query('INSERT INTO Employee SET ?', user,  function (error, results, fields) {
        if (error) {
              res.json({
                  status:false,
                  message:'there are some error with query'
              })
            }else{
                res.json({
                  status:true,
                 
                  message:'data has been created in database'
              })
            }
          });
    })


app.put('/update_data',(req, res) => {


     
          //  var user_id = req.params.EmpID;
    
            //get data
            var data = {
               //  EmpID:req.body.EmpID,
                 Name:req.body.Name,
                 EmpCode:req.body.EmpCode,
                 Salary: req.body.Salary,
                 Email:req.body.Email,
                 phone:req.body.phone
            }


            console.log(req.body.EmpID);
         mysqlConnection.query("UPDATE Employee set ? WHERE EmpID = ? ",[data,req.body.EmpID], function(error, rows){
    
                    if (error) {
                        res.json({
                            status:false,
                            message:'there are some error with query'
                        })
                      }else{
                          res.json({
                            status:true,
                           
                            message:'data has been updated in database'
                        })
                      }
    
               // res.sendStatus(200);
            });
            
    

       
            //inserting into mysql

               
    
              
})



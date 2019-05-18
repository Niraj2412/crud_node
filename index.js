      const mysql = require('mysql');
      const express = require('express');
      var app = express();
      const bodyparser = require('body-parser');
      const fs   = require('fs');
      const jwt   = require('jsonwebtoken');
      var bcrypt = require('bcryptjs');
      var nodemailer = require('nodemailer');


      
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
      // app.get('/employees',verifyToken, (req, res) => {
      
 
      
      //   jwt.verify(req.token, 'secretkey', (err, authData) => {
      //     if(err){
      //       console.log(err)
      //       res.sendStatus(403);
      //     }
      
      //     else{
      //       mysqlConnection.query('SELECT * FROM user_data', (err, rows, fields) => {
      //         if (!err)
      //             res.send(rows);
      //         else
      //             console.log(err);
      //     })
      //     }
         
      //   })  
      // });



      app.get('/employees', (req, res) => {
    
            mysqlConnection.query('SELECT * FROM user_data', (err, rows, fields) => {
                if (!err)
                    res.send(rows);
                else
                    console.log(err);
            })
        });

        // Login With token

        app.get('/api/employees',verifyToken, (req, res) => {
      

        
          jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err){
              console.log(err)
              res.sendStatus(403);
            }
        
            else{
              mysqlConnection.query('SELECT * FROM user_data', (err, rows, fields) => {
                if (!err)
                    res.send(rows);
                else
                    console.log(err);
            })
            }
           
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
          
          mysqlConnection.query('DELETE FROM user_data WHERE EmpID = ?', [req.params.id], (err, rows, fields) => {
              if (!err)
                 // console.log(res.send(rows))
              
                  res.send(JSON.parse(JSON.stringify(rows)));
              else
                  console.log(err);
          })
      });
      
      
      app.post('/create_data',(req, res) => {
      
      
      var user = {
           id:req.body.id,
           UserName:req.body.UserName,
           Email:req.body.Email,
           FullName:req.body.FullName,
           Password: req.body.Password
          
      }
        
         mysqlConnection.query('INSERT INTO user_data SET ?', user,  function (error,rows, results, fields) {

          console.log(rows);

              if (error) {
                
                if(error.code == "ER_DUP_ENTRY"){
                
                  res.json({
                    status:false,
                   
                    message:'Duplicate Entry'
                   
                  })
                }
              
                else{
                  res.json({
                    status:false,
                   
                    message:'Something wrong'
                })
                }
              }
                  
                  
                  else{

                    var transporter = nodemailer.createTransport({
                      service: 'gmail',
                      auth: {
                        user: 'nirajm@cubestackdesign.com',
                        pass: 'niraj1993'
                      }
                    });
                    var mailOptions = {
                      from: 'nirajm@cubestackdesign.com',
                      to: req.body.Email,
                      subject: 'You have registered Successfully',
                      html: '<h1>Welcome</h1> <br> <p>Your Details are mentioned below</p> <br>' + req.body.UserName + '<br>'+ req.body.Password
                    };

                    console.log(mailOptions)
                    transporter.sendMail(mailOptions, function(error, info){
                      if (error) {
                        console.log(error);
                      } else {
                        console.log('Email sent: ' + info.response);
                      }
                    });

                      res.json({
                        status:true,
                       
                        message:'User has registered sucessfully'
                    })
                  }
                });
          })



          app.post('/api/login', (req, res) => {
              
            console.log(req.body.UserName);

            var UserName= req.body.UserName;
            var Password = req.body.Password;
            var Email = req.body.Email;
            // Mock user
            const user = {
             
              username: UserName,
              password: Password
            }


            
          
            jwt.sign({user}, 'secretkey', { expiresIn: '30s'}, (err, token) => {
              mysqlConnection.query('SELECT * FROM user_data WHERE UserName = ?',[req.body.UserName],  function (error, results, fields) {
                if (error) {
                  // console.log("error ocurred",error);
                  res.send({
                    "code":400,
                    "failed":"error ocurred"
                  })
                }else{
                    
                  if(results.length >0){
                    if(results[0].Password == Password){
                      res.send({
                        "code":200,
                        "success":"login sucessfull",
                        "token":token
                       });
                    }
                    else{
                      res.send({
                        "code":204,
                        "success":"Email and password does not match"
                          });
                    }
                  }
                  else{
                    res.send({
                      "code":204,
                      "success":"Email does not exits"
                        });
                  }
                }
    
    
              // res.json({
    
              //   token
              // });
            });
            });
          });




      
      // app.put('/update_data',(req, res) => {
      
      
           
      //           //  var user_id = req.params.EmpID;
          
      //             //get data
      //             var data = {
      //                //  EmpID:req.body.EmpID,
      //                  Name:req.body.Name,
      //                  EmpCode:req.body.EmpCode,
      //                  password:req.body.password,
      //                  Salary: req.body.Salary,
      //                  Email:req.body.Email,
      //                  phone:req.body.phone
      //             }
      
      
      //             console.log(req.body.EmpID);
      //          mysqlConnection.query("UPDATE Employee set ? WHERE EmpID = ? ",[data,req.body.EmpID], function(error, rows){
          
      //                     if (error) {
      //                         res.json({
      //                             status:false,
      //                             message:'there are some error with query'
      //                         })
      //                       }else{
      //                           res.json({
      //                             status:true,
                                 
      //                             message:'data has been updated in database'
      //                         })
      //                       }
          
      //                // res.sendStatus(200);
      //             });
                  
          
      
      //     })
      
      
          // app.post('/login',(req, res) => {
      
      
      
          //     var UserName= req.body.UserName;
          //     var Password = req.body.Password;
                
          //        mysqlConnection.query('SELECT * FROM user_data WHERE UserName = ?',[req.body.UserName],  function (error, results, fields) {
          //         if (error) {
          //             // console.log("error ocurred",error);
          //             res.send({
          //               "code":400,
          //               "failed":"error ocurred"
          //             })
          //           }else{
                        
          //             if(results.length >0){
          //               if(results[0].Password == Password){
          //                 res.send({
          //                   "code":200,
          //                   "success":"login sucessfull"
          //                  });
          //               }
          //               else{
          //                 res.send({
          //                   "code":204,
          //                   "success":"Email and password does not match"
          //                     });
          //               }
          //             }
          //             else{
          //               res.send({
          //                 "code":204,
          //                 "success":"Email does not exits"
          //                   });
          //             }
          //           }
          //         });
          //     })
      
          app.post('/api/posts', verifyToken, (req, res) => {  
              jwt.verify(req.token, 'secretkey', (err, authData) => {
                if(err) {
                  res.sendStatus(403);
                } else {
                  res.json({
                    message: 'Post created...',
                    authData
                  });
                }
              });
            });
            
     
            
            // FORMAT OF TOKEN
            // Authorization: Bearer <access_token>
            
           // Verify Token
            function verifyToken(req, res, next) {
              // Get auth header value
              const bearerHeader = req.headers['authorization'];
              // Check if bearer is undefined
              if(typeof bearerHeader !== 'undefined') {
                // Split at the space
                const bearer = bearerHeader.split(' ');
                // Get token from array
                const bearerToken = bearer[1];
                // Set the token
                req.token = bearerToken;
                // Next middleware
                next();
              } else {
                // Forbidden
                res.sendStatus(403);
              }
            
            }   
                
      
            app.post('/contact', function(req, res) {

              console.log(req.query.message);
              var mailOpts, smtpConfig;
              //Setup Nodemailer transport, I chose gmail. Create an application-specific             password to avoid problems.
              smtpConfig = nodemailer.createTransport('SMTP', {
                  service: 'Gmail',
                  auth: {
                    user: 'nirajm@cubestackdesign.com',
                    pass: 'niraj1993'
                  }
              });


              //Mail options
              mailOpts = {
                  from: 'nirajm@cubestackdesign.com',
                  //grab form    data from the request body object
                  to: 'nirajm@cubestackdesign.com',
                  subject: 'Website contact form',
                  text: req.query.message
              };
              // console.log(mailOpts);
              smtpConfig.sendMail(mailOpts, function(error, response) {
                  //Email not sent
                  if (error) {
                      res.end("Email send failed");
                      //res.render('contact', { title: 'Raging Flame Laboratory - Contact',   msg: 'Error occured, message not sent.', err: true, page: 'contact' })
                      //console.log("error");
                  }//Yay!! Email sent
                  else {
                      res.end("Email send successfully");
                      //res.render('contact', { title: 'Raging Flame Laboratory - Contact',  msg: 'Message sent! Thank you.', err: false, page: 'contact' })
                      //console.log("success");
                  }
              });
          });
      
      

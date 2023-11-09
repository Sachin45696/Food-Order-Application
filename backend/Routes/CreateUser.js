const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const jwtSecret="mynameissachinsharmafromakurdi$#"
const jwt=require("jsonwebtoken")
const bcrypt=require('bcryptjs');




router.post(
  "/createuser",
  [
    body("email").isEmail(),
    //password must be atleast 5chars
    body("name").isLength({ min: 5 }),

    body("password", "Incorrect password").isLength({ min: 5 }),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const salt =await bcrypt.genSalt(10);
    let secPassword=await bcrypt.hash(req.body.password,salt)
    try {
      await User.create({
        name: req.body.name,
        password: secPassword,
        email: req.body.email,
        location: req.body.location,
      });
      res.json({ success: true });
    } catch (error) {
      console.log(error);
      res.json({ success: false });
    }
  }
);

router.post(
    "/loginuser",
    [
      body("email").isEmail(),
      body("password", "Password must be at least 5 characters").isLength({ min: 5 }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let email=req.body.email;
      try {
        
        let userData = await User.findOne({ email });
  
        if (!userData) {
          return res.status(400).json({ errors: "Try loggin with correct creadentials ." });
        }
  
        const pwdCompare= await bcrypt.compare(req.body.password,userData.password)

        // Compare the hashed password (you should use bcrypt or another secure hashing library)
        if (!pwdCompare) {
          return res.status(400).json({ errors: "Try loggin with correct creadentials ." });
        }
  
       const data={
        user:{
          id:userData.id 
        }
       }
       const authToken=jwt.sign(data,jwtSecret)

        return res.json({ success: true,authToken:authToken});
      } catch (error) {
        console.error(error);
        return res.status(500).json({ errors: "An error occurred while processing your request." });
      }
    }
  );
  

module.exports = router;




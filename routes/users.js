const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Addorder=require('../models/addorder');
const Additem=require('../models/additem');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const { response } = require('express');




router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    displayName: user.displayName,
    email:user.email,
    contact:user.contact,
    address:user.address,
    id: user._id,
  });
});


router.post("/additem",async (req, res) => {
  
  try {
    let {  item,price } = req.body;

   
    const newItem = new Additem({
    item,
    price
    });
    const savedItem = await newItem.save();
    res.json(savedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/viewitems', async(req,res)=>{
  try {
      const items=await Additem.find();
      res.json(items);
  } catch (error) {
      res.send({"error":error});
      console.log(error);
  }
});

router.get('/viewitems/:id', async (req, res) => {
  try {
    const items = await Additem.findById(req.params.id)
    res.json(items)
  } catch (err) {
    res.send('Error ' + err)
  }
})



router.post("/addorder",async (req, res) => {
  const user = await User.findById(req.user);
  
  try {
    let { date, item, itemquantity, totalamount ,employeename} = req.body;

   
    if (!date || !item || !itemquantity || !totalamount ||!employeename )
      return res.status(400).json({ msg: "Not all fields have been entered." });
    
    const newOrder = new Addorder({
      date,
     item,
      itemquantity,
      totalamount,
      employeename:employeename
    });
    const savedOrder = await newOrder.save();
    res.json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/vieworders', async(req,res)=>{
  try {
      const items=await Addorder.find();
      res.json(items);
  } catch (error) {
      res.send({"error":error});
      console.log(error);
  }
});

router.get('/vieworders/:id', async (req, res) => {
  try {
    const items = await Addorder.findById(req.params.id)
    res.json(items)
  } catch (err) {
    res.send('Error ' + err)
  }
})


router.get('/viewreports/:employeename', async (req, res) => {
  try {
    const items = await Addorder.find({employeename:req.params.employeename})
    res.json(items)
  } catch (err) {
    res.send('Error ' + err)
  }
})


router.post("/register", async (req, res) => {
  try {
    let { email, password, passwordCheck, displayName,contact,address } = req.body;


    if (!email || !password || !passwordCheck || !contact || !address )
      return res.status(400).json({ msg: "Not all fields have been entered." });
    if (password.length < 5)
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 5 characters long." });
    if (password !== passwordCheck)
      return res
        .status(400)
        .json({ msg: "Enter the same password twice for verification." });

    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });

    if (!displayName) displayName = email;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      displayName,
      contact,
      address
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    res.json(user)
  } catch (err) {
    res.send('Error ' + err)
  }
})


router.delete("/delete", auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password} = req.body;
    console.log(email);
    if (!email || !password) {
      return res.status(400).json({ msg: "Not all fields have been entered." });



    }
    const user = await User.findOne({ email: email });
    if (!user)
      return res.status(400).json({ msg: "No account created" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid credentials" });


    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      token: token,
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        contact:user.contact,
        address:user.address
      }
    });


  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
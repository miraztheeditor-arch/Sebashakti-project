const mongoose = require('mongoose');

const uri = "mongodb+srv://miraztheeditor_db_user:PFY2lFpW4uKiea2V@cluster0.n1q1d.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => {
    console.log("সফলভাবে ডাটাবেজ কানেক্ট হয়েছে!");
  })
  .catch((err) => {
    console.error("কানেকশনে সমস্যা হয়েছে:", err.message);
  });
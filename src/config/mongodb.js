const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://noisetrack:gxSOOQ1JmUou0DFJ@cluster0.zojxrcv.mongodb.net/?retryWrites=true&w=majority', {
        useNewUrlParser: true,   
        useUnifiedTopology: true,    
        useFindAndModify: false,    
    })
    .then(db => console.log("MongoDB is connected"))
    .catch(err => console.error(err))
      
//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const app = express();
const _= require("lodash");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin_simran:Simran1317@cluster0-r9se2.mongodb.net/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const itemSchema = {
  name:{
    type:String
  }
};

const Item = mongoose.model("Item",itemSchema);


const item1= new Item({
  name: "Welcome to Your To-do-list"
});

const item2=new Item({
  name: "hit + button to add new item"
});

const item3=new Item({
  name: "<--Click here to delete an item"
});

const defaultItems=[item1,item2,item3];

const ListSchema={
  name : String,
  items :[itemSchema]
};
const List = mongoose.model("list",ListSchema);

app.get("/", function(req, res) {



  Item.find({},function(err,foundItems){
    if(err){
      console.log(err);
    }
    else{
      if (foundItems==0){

        Item.insertMany(defaultItems,function(err){
          if(err){
            console.log(err);
          }
          else{
            console.log("succesfully added 3 items");
          }
        });
        res.redirect("/");


      }
      else{
       res.render("list", {listTitle: "Today", newListItems: foundItems});
      }


    }
  });


  const day = date.getDate();




});

app.post("/", function(req, res){


   const itemName= req.body.newItem;
   const listname=req.body.list;


   const item = new Item ({
     name: itemName
   });

   if(listname=="Today"){
     item.save();
     res.redirect("/");
   }
   else{
     List.findOne({name:listname},function(err, foundlist){
       foundlist.items.push(item);
       foundlist.save();
       res.redirect("/"+listname)
     });
   }


});

app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listname;
  if(listName=="Today"){
    Item.findByIdAndRemove(checkedItemId,function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("deleted");
        res.redirect("/");
      }
    });

  }
  else{
    List.findOneAndUpdate({name:listName},{$pull: {items: {_id: checkedItemId}}},function(err,foundlist){
      if(!err){
        res.redirect("/" + listName);

      }
    });
  }
});

app.get("/:customlistname", function(req,res){
  const customListName= _.capitalize(req.params.customlistname);
  List.findOne({name:customListName},function(err,foundlist){
    if(!err){
      if(!foundlist){
        //create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/"+customListName);
      }
      else{
        //show the list
        res.render("list", {listTitle: foundlist.name, newListItems: foundlist.items});
      }
    }
  });

});


app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port,function(){
  console.log("Server has been strated succesfully")
});

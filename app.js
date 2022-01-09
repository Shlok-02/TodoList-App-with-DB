//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//Mongo DB 
mongoose.connect("mongodb://localhost:27017/todoListDB",{useNewUrlParser:true});


//creating the schema
const itemSchema={
  name:String
}

const listSchema={
  name:String,
  items:[]
}

const Item=mongoose.model("item",itemSchema); //creating a model based on scheman
const List=mongoose.model("list",listSchema);


const item1=new Item({ //creating a entry on basis of model
  name:"Buy Food"
})

const item2=new Item({
  name:"Buy Coeffee"
})

const defaultItems=[item1,item2];



//Insert or save data in Model
/* Item.insertMany(defaultItems,(err)=>{
  if(err){
    console.log(err);
  }else{
    console.log("Successfully Added");
  }
})
 */

/* 
Item.deleteOne({name:"Buy Coeffee"},(err)=>{
          if(err){
            console.log(err);
          }else{
            console.log("Success");
          }
 */



//express and ejs part
app.get("/", function(req, res) {
  //find and display the data from model
  
  Item.find((err,data)=>{

    if(err){
      console.log(err);
    }
    else{

      if(data.length===0){
        Item.insertMany(defaultItems,(err)=>{
          if(err){
            console.log(err);
          }else{
            console.log("Successfully Addded");
          }
        })
        res.redirect("/");
      }
      else{
        res.render("list", {listTitle: "Today", newListItems: data});
        console.log(data); 
      }
    }
}) 
});



app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName=req.body.list;

  const item=new Item({
    name:itemName
  })

  if(listName==="Today"){
    item.save();
    res.redirect("/");
  }else{
    List.foundOne({name:listName},(err,data)=>{
      data.items.push(item);
      res.redirect("/"+listName)
    })
  }
  
});

app.post("/delete",(req,res)=>{
  const id=req.body.check;
  const listName=req.body.listName;
  if(listName==="Today"){
    Item.deleteOne({_id:id},(err)=>{
      if(err){
        console.log(err);
      }else{
        console.log("Delete Successfully",id);
      }
    })
    res.redirect("/")
  }else{
    Item.findOneAndUpdate({name:listName},{$pull:{items:id}},(err,data)=>{
      if(!err){
       res.redirect("/"+listName)
      }else{
        console.log(err);
      }
    })
  }
  
})


//for custom routes to create the list @ that routes
app.get("/:customRoute",(req,res)=>{
  const nameRoute=req.params.customRoute;
  List.findOne({name:nameRoute},(err,data)=>{
    if(err){
      console.log(err);
    }else{
      if(!data){
        const list=new List({
          name:nameRoute,
          items:defaultItems
        })
      
        list.save();
        res.redirect("/")
      }else{
        res.render("list", {listTitle: data.name, newListItems: data.items});
      }
    }
  })
 /*   */

})








app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

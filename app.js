//  updation is done in sec 28 previous content is in commented part.

const express=require("express");

const bodyparser=require("body-parser");

// const date=require(__dirname+"/date.js");

const mongoose=require('mongoose');

const _ =require("lodash");

app=express();

// const items=["buy food","cook food","eat food"];


app.use(bodyparser.urlencoded({extended:true}));

app.use(express.static("public"));

app.set('view engine','ejs');

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB",{useNewUrlParser:true});

// here bascially we changed it to 127.0.0.1 from 3000 and removing extra forward slash from their to renew the db name.
// const workitems=[];

const itemSchema=new mongoose.Schema({
  name:String
});

const Item=mongoose.model("Item",itemSchema);

const term1=new Item({
  name:"Welcome to your todolist"
});

const term2=new Item({
  name:"Hit + button to add the new item"
});

const term3=new Item({
  name:"<-- Hit this to delete an item"
});

const defaultItems=[term1,term2,term3];

// Item.insertMany(defaultItems).then(function(){
//   console.log("sucessfully add");
// }).catch(
//   function(err){
//     console.log(err);
//   }
// );

// Item.deleteMany({name:"fkkdl"}).then(function(){
//   console.log("Sucessfully deleted required stuff");
// }).catch(function(err){
//   console.log(err);
// });

const listSchema={
  name:String,
  items:[itemSchema]
  // as we want to match only the element to elment part hence square braces are required there.
}

const List=mongoose.model("List",listSchema);

app.get("/",function(req,res){

Item.find().then(function(founditems){
  if (founditems.length===0) {
    Item.insertMany(defaultItems).then(function(){
      console.log("sucessfully add");
    }).catch(
      function(err){
        console.log(err);
      }
    );
    res.redirect("/");
  }
  else {
  res.render("list",{
    listitle:"Today",
    newlistitems:founditems
  });
}
}).catch(function(err){
  console.log(err);
});

//   if (today.getDay()===6)
//   // res.write("Holiday!");
//   day="weekend";
//   else {
//   // res.write("Working!");
//   // res.write("better to balance between the activities");
//   day="weekday";
// }

// const l=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
// day=l[today.getDay()];


// const day=date.getDate();



// res.render("list",{
//   listitle:"Today",
//   newlistitems:items
// });
  // res.send();
});

app.get("/:customListName",function(req,res){
  const customListName=_.capitalize(req.params.customListName);
  List.findOne({name:customListName}).then(function(founditem) {
    if (!founditem) {  //new entry
      const list=new List({
        name:customListName,
        items:defaultItems
      });
      list.save();
      res.redirect("/"+customListName);
    }
    else {
       //alerady there
       res.render("list",{
         listitle:founditem.name,
         newlistitems:founditem.items
       });
    }

  }).catch(function(err){
    console.log(err);
  })

});

app.post("/",function(req,res){

 const newitem=req.body.newitem;

const listName=req.body.list;

 item =new Item({
   name:newitem
 });

 if (listName==="Today") {
 item.save();
 res.redirect("/");
}else {
  List.findOne({name:listName}).then(function(foundlist){
    foundlist.items.push(item);
    foundlist.save();
    res.redirect("/"+listName);
  }).catch(function(err){
    console.log(err);
  })
}
//    if (req.body.list==="Work") {
//      workitems.push(item);
//      res.redirect("/work");
//    }
//    else {
//    items.push(item);
//   res.redirect("/");
// }
});

app.get("/work",function(req,res){
  res.render("list",{
    listitle:"Work List",
    // newlistitems:workitems
  });
});

app.get("/about",function(req,res){
  res.render("about");
});

// app.post("/work",function(req,res) {
//   const item=req.body.newitem;
//   workitems.push(item);
//   res.redirect("/work");
// }
// );
app.post("/delete",function(req,res){
  const idn=req.body.checkbox;

const listName=req.body.ListName;

  if (listName==="Today") {
    Item.findByIdAndRemove(idn).then(function(){
      console.log("deleted sucessfully");
      res.redirect("/");
    }).catch(function(err){
      console.log(err);
    });

  }else {
    List.findOneAndUpdate({name:listName},
      {$pull:{items:{_id:idn}}}
    ).then(function(foundlist){
      // requires here as a parameter as updation required there also.
      res.redirect("/"+listName);
    }).catch(function(err){
      console.log(err);
    });

  }


});
app.listen(3000,function(){
  console.log("server is running!");
});

// Another solution to the challenge of printing the day of week
// currentday=today.getDay();
// switch (currentday) {
//   case 0:
//   day="Sunday"
//     break;
//
//   case 6:
//   day="Saturday"
//   break;
//
//   default: console.log("this is not going to happen at all");
//
// }

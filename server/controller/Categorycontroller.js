const slugify=require("slugify");
const categoryModel=require("../model/CategoryModel")

module.exports.createCategory=async function createCategory(req,res){
    try {
        const {name}=req.body;
        if(!name){
            return res.status(402).send({
                success:false,
                message:"Name is required"
            })
        }
        const existingCategory=await categoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success:false,
                message:"category already exist",
            })
        }
        const category = await new categoryModel({
            name,
            slug: slugify(name),
          }).save();
          res.status(201).send({
            success: true,
            message: "new category created",
            category,
          });
    } catch (error) {
        res.status(500).send({
            success:false,
            message: error.message,
          });
    }
}


module.exports.updateCategory=async function updateCategory(req,res){
    try {
        const {name}=req.body;
        console.log("name is ",name)
        const {id}=req.params;
        console.log("id is ",id);
        const category=await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true});

        console.log("item found ")
        res.status(200).send({
            success: true,
            messsage: "Category Updated Successfully",
            category,
          });
    } catch (err) {
        res.send({
            message: err.message,
            success: false,
        })
    }

}

module.exports.deleteCategory=async function deleteCategory(req,res){
    try {
        let id=req.params.id;
        let deleted=await categoryModel.findByIdAndDelete(id);
        if(deleted){
            return res.send({
                message: 'category deleted successfully',
                success: true,
                data: deleted
            })
        }
        else{
            return res.send({
                message: 'category not found',
                success: false,
            })
        }
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
        })
    }
}

module.exports.getallcategory=async function getallcategory(req,res){
   try {
    let category=await categoryModel.find();
    if(category){
        return res.status(200).json({
            success:true,
            message:"all category retreived successfully",
            category
        })
    }
    else{
        return res.status(201).send({
            message: 'categories not found',
            success: false,
          })
    }
    
   } catch (error) {
    res.send({
        message: error.message,
        success: false,
    })
   } 
}


module.exports.getcategory=async function getcategory(req,res){
    try {
        let find=req.params.slug //can also use destructure property
        if(find){
            let category=await categoryModel.findOne({slug:find})
            if(category){
                return res.send({
                    success:true,
                    message:"category retreived successfully",
                    category
                })
            }
            else{
                return res.status(401).send({
                  message:"no such category found",
                  success:false
                })
              }
        }
        else{
            return res.status(400).send({
              message:"no such id found",
              success:false
            })
          }
    } catch (err) {
        res.send({
            message: err.message,
            success: false,
        })
    }
}
const Category = require("../models/category.model");

const createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      // Return a more descriptive error message with the id of the existing category
      return res.status(409).json({ error: 'Category already exists', id: existingCategory._id });
    }

    const newCategory = new Category({
      name,
      description,
    });

    await newCategory.save();

    // Return a success message with the newly created category object
    return res.status(200).json({ message: 'Category created successfully', category: newCategory });
  } catch (error) {
    console.log(error);
    // Return a generic error message with a 400 status code
    return res.status(400).json({ error: 'Error creating category' });
  }
};


const updateCategory= async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    return res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update category' });
  }
};

const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const deletedCategory = await Category.findByIdAndRemove(categoryId);
    if (deletedCategory) {
      return res.sendStatus(200);
    } else {
      return res.sendStatus(404);
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

const getAllCategories = async(req, res) => {
  try{
    const allCategories = await Category.find();
    res.status(200).json(allCategories);
  } catch ( error ){
    console.log(error);
    return res.status(500).send("Internal server error");
  }
}


module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
}
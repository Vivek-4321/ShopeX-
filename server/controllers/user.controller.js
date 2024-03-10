const User = require('../models/user.model');

const userProfile = async (req, res) => {
    const { id } = req.params;
  
    try {
      const existingUser = await User.findById(id);
  
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      return res.status(200).json(existingUser);
    } catch (err) {
      return res.status(400).json(err);
    }
  };
  

const userUpdate = async(req, res) => {
    const { id } = req.params;
    const { username } = req.body;

    try{

        const user = await User.findOne({ _id : id });
        
        if(user) {
            const updatedUser = await User.findByIdAndUpdate(id, {username}, {new: true});
            return res.status(200).json(updatedUser);
        }

        else{
            return res.status(400).json("user not found");
        }

    } catch (err) {
        return res.status(400).json(err);
    }
}

const userDelete = async(req,res) => {
    const { id } = req.params;

    try{

        const user = await User.findOne({ _id : id });
        
        if(user) {
            const DeletedUser = await User.findByIdAndDelete({ _id: id});
            return res.status(400).send("User is deleted");
        }

        else{
            return res.status(400).json("user not found");
        }

    } catch (err) {
        return res.status(400).json(err);
    }
}

module.exports = {
    userProfile,
    userUpdate,
    userDelete,
}
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import generateTokenandSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // const hashedPassword 
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullName,
            username,
            password:hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic
        });

        if(newUser){

         generateTokenandSetCookie(newUser._id,res);
            // generate jwt token
        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            profilePic: newUser.profilePic,
        });
    }else{
        res.status(400).json({ error: "Failed to create user" });
    }
   
    } catch (error) {
        console.error("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async(req, res) => {
   try{

      const {username, password} =req.body;
      const user=await User.findOne({username});
      const isPasswordCorrect=await bcrypt.compare(password, user?.password || "");
      if(!user || !isPasswordCorrect){
        return res.status(400).json({error: 'Invalid password or username'});
      }

      generateTokenandSetCookie(user._id,res);
   
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        profilePic: user.profilePic,
    });      

   }catch(error){
    console.log("error in login controller",error.message)
    res.status(500).json({ error: "Internal server error" });
   }
};

export const logout = (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
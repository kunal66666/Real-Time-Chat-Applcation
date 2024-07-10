import jwt from 'jsonwebtoken';


const generateTokenandSetCookie=(userId,res)=>{
    
 const token=jwt.sign({ userId },process.env.JWT_SECRET,{ expiresIn: '15d' });    

 res.cookie("jwt",token,{
    maxAge:15*24*60*60*1000,
    httpOnly:true, //prevent xss attack cross-site scripting attack
    secure:process.env.NODE_ENV !== 'development',
    sameSite:'strict' //csrf attack cross site reqquest forergery attack
 });
}


export default generateTokenandSetCookie;
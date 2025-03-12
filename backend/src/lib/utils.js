import jwt from "jsonwebtoken";

export const generateToken = (UserId,res) =>{
    const token = jwt.sign({UserId},process.env.JWT_SECRET,{
        expiresIn:"5d",
    });

    res.cookie("jwt", token,{
        maxAge: 7*24*60*60*1000, 
        httpOnly:true
    })

    return token;
};
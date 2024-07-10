import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
export const sendMessage=async(req,res)=>{
    try {
		const { message } = req.body; //get trough body
		const { id: receiverId } = req.params; //get troguh pramter
		const senderId = req.user._id; //it will came thrigh middle ware beacuse user will login so we get it from middle ware


       let conversation= await Conversation.findOne({
            participants:{$all:[senderId, receiverId]},

        })
     if(!conversation){
     conversation=await Conversation.create({
        participants: [senderId, receiverId], 
    })
    }


    const newMessage=new Message({
        senderId,
        receiverId,
        message,
    })
  
    if(newMessage){
        conversation.messages.push(newMessage._id);
        
    }

    // socket io functionality to make it real time
    // await conversation.save();
    // await newMessage.save();

    // this will run in parallel
    await Promise.all([conversation.save(), newMessage.save()]);
    res.status(201).json(newMessage);

       

    } catch(error){
        console.log("error in sendmessge controller",error.message);
        res.status(500).json({error:"internal server error"});
    }
    
}


export const getMessages=async(req,res)=>{


    try{

        // populate beacuse qwe are storing id of messages so monngose will give us each object
        const {id:userToChatId}=req.params;
        const senderId=req.user._id;
        const conversation=await Conversation.findOne({
            participants:{$all:[senderId, userToChatId]},
        }).populate("messages"); //not referbce but actual message

        if(!conversation) return res.status(200).json([]);
        const messages=conversation.messages;
        res.status(200).json(messages);

    }catch(error){
    
            console.log("error in sendmessge controller",error.message);
          res.status(500).json({error:"internal server error"});
        
    }
}



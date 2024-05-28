import express from 'express';
import {prisma} from '../util/prisma/index.js'
const router = express.Router();

router.post('/item',async (req, res, next)=>{
    const {itemName, itemStat, itemPrice} = req.body;

    const isExistItem = await prisma.items.findFirst({
        where:{
            itemName
        }
    });
    if(isExistItem){
        return res.status(409).json({message:'이미 존재하는 아이템 입니다'})
    }
    const item=await prisma.items.create({
        data:{
            itemName,
            itemStat : JSON.stringify(itemStat),
            itemPrice
        }
    });
    return res.status(201).json({message:'아이템 생성 되었습니다', data:item});
})

export default router;
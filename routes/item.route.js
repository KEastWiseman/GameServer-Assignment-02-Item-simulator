import express from 'express';
import {prisma} from '../util/prisma/index.js'
const router = express.Router();

// ** 아이템 생성 **
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

// ** 아이템 수정 **
router.put('/item/:itemId', async (req, res, next)=>{
    const itemId = req.params.itemId;
    const {itemName, itemStat} = req.body;
    const isExistItem = await prisma.items.findFirst({
        where:{
            itemId : +itemId
        }
    });
    if(!isExistItem){
        return res.status(400).json({message:'존재하지 않는 아이템 입니다'});
    }

    const item = await prisma.items.update({
        where:{
            itemId : +itemId
        },
        data:{
            itemName,
            itemStat : JSON.stringify(itemStat)
        }
    })
    return res.status(200).json({message:'성공적으로 아이템이 수정되었습니다', data : item})
})


// ** 아이템 목록 상세 조회
router.get('/item/:itemId', async (req,res,next)=>{
    const itemId = req.params.itemId;

    const item = await prisma.items.findFirst({
        where : {
            itemId: +itemId
        }
    });

    if(!item){
        return res.status(400).json({message:'존재하지 않는 아이템 입니다'});
    }

    return res.status(200).json({message:'성공적으로 조회 했습니다', data:item})
})

router.get('/item', async (req,res,next)=>{
    const items = await prisma.items.findMany({
        select:{
            itemId:true,
            itemName:true,
            itemPrice:true
        }
    })
    return res.status(200).json({message:'성공적으로 아이템 목록 조회 했습니다',data:items});
})
export default router;
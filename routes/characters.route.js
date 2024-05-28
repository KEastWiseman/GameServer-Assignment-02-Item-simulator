import express from 'express';
import {prisma} from '../util/prisma/index.js'
import jwtAuthorization from '../middleware/auth.middleware.js'
const router = express.Router();

// ** 캐릭터 생성 **
router.post('/character', jwtAuthorization, async(req, res, next)=>{
    const {charName} = req.body;
    const userIdx = req.user.userIdx;

    // 캐릭터 이름 중복 검사
    const isExistChar= await prisma.characters.findFirst({
        where:{
            charName,
        },
    });
    if(isExistChar){
        return res.status(409).json({message:'이미 존재하는 캐릭터 이름 입니다'});
    }
    
    await prisma.characters.create({
        data:{
            charName,
            userIdx
        },
    });
    return res.status(201).json({message:'캐릭터 생성이 완료되었습니다'});
})
// ** 캐릭터 상세 조회 캐릭터 단일 아이디 조회 **
router.get('/character/:characterId', jwtAuthorization, async(req,res,next)=>{
    const characterId = req.params.characterId;

    // 캐릭터 조회
    const character = await prisma.characters.findFirst({
        where:{
            characterId : +characterId
        }
    })
    if(req.user.userIdx !== character.userIdx)delete character.money;
    
    return res.status(200).json({message:'캐릭터 조회', data: character})

})


// ** 캐릭터 삭제 **
router.delete('/character/:characterId', jwtAuthorization, async(req,res,next)=>{
    const characterId = req.params.characterId;
    
    // 캐릭터 조회
    const isExistChar = await prisma.characters.findFirst({
        where:{
            characterId : +characterId
        }
    })
    if(!isExistChar){
        return res.status(400).json({message:'존재하지 않는 캐릭터입니다'});
    }

    // 현재 유저가 해당 캐릭터 소유자인지 더블 체크
    if(req.user.userIdx!==isExistChar.userIdx){
        return res.status(401).json({message:'현재 유저의 캐릭터가 아닙니다'});
    }
    await prisma.characters.delete({
        where :{
            characterId:+characterId
        }
    })
    return res.status(200).json({message:'캐릭터가 성공적으로 제거되었습니다'});
})

export default router;
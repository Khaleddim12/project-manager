import jwt from 'jsonwebtoken';

import { Request, Response, NextFunction } from 'express'
import { asyncHandler } from './async'
import { User } from '../models/';
import { IAuthRequest } from '../interfaces';
import {ErrorResponse, errorMessages} from '../utils'

export const authenticate = asyncHandler(async(req: IAuthRequest,res: Response, next: NextFunction)=>{
    let token:string = "";
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')  
    )
        token = req.headers.authorization.split(' ')[1];
    if(!token)
        return next(new ErrorResponse(errorMessages("auth", "user"), 401));   
    
    try{
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        let user
        if(typeof decoded !== "string"){
            user = await User.findById(decoded.id);
            if (!user)
                return next(new ErrorResponse(errorMessages("auth", "user"), 401));
        
            req.user = user;
            next();
        }
    }catch(error){
        return next(new ErrorResponse(errorMessages("auth", "user"), 401));
    }
});
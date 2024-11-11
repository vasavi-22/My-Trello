import express from "express";
import { Router } from "express";
import dotenv from "dotenv";
dotenv.config();
import { OAuth2Client } from "google-auth-library";

const router = Router();

router.post('/', async function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Referrer-Policy', 'no-referrer-when-downgrade');

    const redirectUrl = 'http://localhost:5000/oauth';
    const oAuth2Client = new OAuth2Client(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        redirectUrl
    );

    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type : 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email', 'openid'],
        prompt : 'consent'
    });

    res.json({url: authorizeUrl})
});

export default router;
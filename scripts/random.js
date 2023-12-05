import express from 'express';
import passport from 'passport'
import LocalStrategy from 'passport-local'
import crypto from 'crypto';
import { pool } from '../server.js';
import { v4 as uuidv4 } from 'uuid';
import { failedUserVerification } from '../errors.js';


const salt = crypto.randomBytes(16);
const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
crypto.pbkdf2('password1234', salt, 310000, 32, 'sha256', function (error, hashedPassword) {
    if (error) {
        console.error(`First error: ${error}`)
    } else {
        new Promise((resolve, reject) => {
            const userID = uuidv4();
            const sql = `INSERT INTO user (id,email,password,salt,date) VALUES (?,?,?,?,?)`;
            return pool.query(sql, [userID, 'jelovalera@gmail.com', hashedPassword, salt, datetime], (error) => {
                if (error) {
                    return reject(error);
                } else {
                    return resolve(userID);
                }
            });
        }).then(
            (userID) => {
                console.log('success')
            },
            (error) => {
                console.error(error)
            }
        );
    }
});
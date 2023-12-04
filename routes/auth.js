import express from 'express';
import passport from 'passport'
import LocalStrategy from 'passport-local'
import crypto from 'crypto';
import { pool } from '../server.js';
import { v4 as uuidv4 } from 'uuid';
import { failedUserVerification } from '../errors.js';

export const loginRouter = express.Router();

loginRouter.use(express.urlencoded({ extended: true }));
loginRouter.get('/', (request, result) => {
    if (request.session.passport !== undefined) {
        console.log(`User ID: ${request.session.passport.user.id}`)
    }
    result.render('login');
});

loginRouter.post('/', passport.authenticate('local', {
    successRedirect: '/login',
    failureRedirect: '/login'
}));

loginRouter.post('/signup', (request, result, callback) => {
    const salt = crypto.randomBytes(16);
    const datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    crypto.pbkdf2(request.body.password, salt, 310000, 32, 'sha256', function (error, hashedPassword) {
        if (error) {
            return callback(error);
        } else {
            new Promise((resolve, reject) => {
                const userID = uuidv4();
                const sql = `INSERT INTO user (id,email,password,salt,date) VALUES (?,?,?,?,?)`;
                return pool.query(sql, [userID, request.body.email, hashedPassword, salt, datetime], (error) => {
                    if (error) {
                        return reject(error);
                    } else {
                        return resolve(userID);
                    }
                });
            }).then(
                (userID) => {
                    request.logIn(userID, (error) => {
                        if (error) { return callback(error) }
                        result.redirect('../budget');
                    });
                },
                (error) => {
                    return callback(error)
                }
            );
        }
    });
});

const localStrategyOptions = {
    usernameField: 'email',
    passwordField: 'password'
}
passport.use(new LocalStrategy(localStrategyOptions,function verify(email, password, callback) {
    new Promise((resolve, reject) => {
        const sql = `SELECT * FROM user WHERE email = ?`;
        return pool.query(sql, [email], (error, result) => {
            if (error) {
                return reject(callback(error));
            } else if (result.length === 1) {
                return resolve(result[0]);
            } else {
                return reject(callback(null, false, { message: failedUserVerification }));
            }
        });
    }).then(
        (user) => {
            crypto.pbkdf2(password, Buffer.from(user.salt, 'utf-8'), 310000, 32, 'sha256', function (error, hashedPassword) {
                if (error) { return callback(error); }
                if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
                    return callback(null, false, { message: failedUserVerification })
                } else {
                    return callback(null, user.id);
                }
            });
        },
        (errorCallback) => { 
            return errorCallback 
        }
    );
}));

passport.serializeUser(function (userID, callback) {
    process.nextTick(function () {
        callback(null, { id: userID })
    });
});
passport.deserializeUser(function (user, callback) {
    process.nextTick(function () {
        return callback(null, user);
    });
});


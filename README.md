## Description
User Authentication and Authorization Service 
Project built with idea that saving user sessions in server-side and control ( update and expire ) it and for more security

## Getting started
1. Start the service 
```bash 
docker-compose up --build 
```
1. Open Swaggers UI at <http://localhost:3000/api>.

## Test
```bash
# unit tests
$ npm run test
```
## Basic Concepts
* Project was built with 
* Nestjs 
* MongoDb 
* `Redis` for storing sessions 
* Swagger for API Docs 
* JWT as Authentication middleware ( not as Session Management ) 
* Server-side sessions Approach 
* Docker

## System User Type
- user: ( register, login, logout, update-user, get-session )
- admin: User Actions + ( force logout user )
Note: These actions are API Endpoints and found in swaggers link 
Note: Using `Patch /users` you can update user type from `admin` to `user` or opposite 

## Topics Discoverd
- Drawbacks for using JWT for session management
- stateless JWT, stateful JWT, Server-side sessions
- Server-side sessions Store type ( MongoDB vs Redis vs server local memory )


### WorkFlows
#### User try to Login
- [Guard] check if user data is found and correct
- [AuthService] build JWT token with only static user data ( permanent ) like id
- [AuthService] sent JWT token to user with response to use this token with `Bearer Tokens` in next requests 
- [AuthService] Call Session Service to create user session
- [SessionService] build user session from user data
- [SessionService] build user session key for using in Caching
- [SessionService] call Caching Module `REDIS` to set user session data

#### Admin try to logout specific user
- [Guard] check if admin is Authenticated from Token in request header
- [Guard] get admin Id from token after decryption
- [Guard] get admin session key and check if he still has a valid session
- [Guard] check if admin has permission to perform this action
- [AuthService] check if user id is valid Id or not ( check if it is mongodb Id )
- [AuthService] Call Session Service to force logout user with target user Id 
- [SessionService] build target user session key
- [SessionService] Remove user session from cache

## Left Outs
- more testing ( Unit & Integration )
- refactor more dynamic approach for authorization like saving permission and User Ids which has access to these premission in datastore[ Main Database or Cache ] 
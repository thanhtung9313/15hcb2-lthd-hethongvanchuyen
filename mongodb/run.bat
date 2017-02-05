@echo off
set MONGO=C:\mongodb\bin
set PATH=%PATH%;%MONGO%;
mongod --journal --config mongo.config
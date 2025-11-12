// import express from "express"
// import dotenv from "dotenv"
// import app from "./app"

const express = require("express")
const dotenv = require("dotenv")
const app = require("./app")

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`)
})

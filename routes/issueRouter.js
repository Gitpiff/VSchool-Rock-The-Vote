const express = require("express")
const issueRouter = express.Router()
const Issue = require("../models/issue.js")

//Get All Issues
issueRouter.get("/", (req, res, next) => {
    Issue.find((err, issues) => {
        if(err){
            res.status(500)
            return next(err)
        }

        return res.status(200).send(issues)
    })
})

//Get Issues by User Id
issueRouter.get("/user", (req, res, next) => {
    Issue.find({ user: req.auth._id }, (err, issues) => {
        if(err){
            res.status(500)
            return next(err)
        }

        return res.status(200).send(issues)
    })
})

//Add New Issue
issueRouter.post("/", (req, res, next) => {
    req.body.user = req.auth._id
    const newIssue = new Issue(req.body)
    newIssue.save((err, savedIssue) => {
        if(err){
            res.status(500)
            return next(err)
        }

        return res.status(201).send(savedIssue)
    })
})

//Update Issue
issueRouter.put("/:issueId", (req, res, next) => {
    Issue.findOneAndUpdate(
        { _id: req.params.issueId, user: req.auth._id },
        (err, updatedIssue) => {
            if(err){
                res.status(500)
                return next(err)
            }

            return res.status(201).send(updatedIssue)
        }
    )
})

//Delete Todo
issueRouter.delete("/:issueId", (req, res, next) => {
    Issue.findOneAndDelete(
        { _id: req.params.issueId, user: req.auth._id },
        (err, deletedIssue) => {
            if(err){
                res.status(500)
                return next(err)
            }

            return res.status(201).send(`Successfully deleted issue ${deletedIssue.title}`)
        }
    )
})


module.exports = issueRouter

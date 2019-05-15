const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

// routes
exports.helloWorld = require('./routes/helloWorld')

// triggers
exports.setUnreadMsgNotifPrivateMsgs = require('./triggers/setUnreadMsgNotifPrivateMsgs')
// exports.setUnreadMsgNotifPublicMsgs = require('./triggers/setUnreadMsgNotifPublicMsgs')

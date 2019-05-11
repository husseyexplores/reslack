const admin = require('firebase-admin')
admin.initializeApp()

// routes
exports.helloWorld = require('./routes/helloWorld')

// triggers
// exports.setUnreadMsgNotifications = require('./triggers/setUnreadMsgNotifications')

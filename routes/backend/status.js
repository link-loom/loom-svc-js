function status(dependencies) {
    /**
     * Status
     * 
     * route to show message (GET http://<<URL>>/api/Status)
     */
    const get = function (req, res) {
        res.json({ success: true, message: 'API is online' });
    }

    return {
        get: get
    }
}

module.exports = status;
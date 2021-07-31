const router = require('express').Router();
const userService = require('../../services/userService');
router.post('/', async (req, res) => {
    let result;
    try {
        result = await userService().bulkCreateUser(req.body.users);
    } catch (error) {
        return res.status(400).send(error);
    }
        return res.status(200).send(result);
});

router.post('/:userId/portfolio',async (req, res) => {
    let result;
    try {
        result = await userService().createPortfolio(req.params.userId, req.body);
    } catch (error) {
        return res.status(400).send(error);
    }
        return res.status(200).send(result);
});


router.get('/', async (req, res) => {
    let result;
    try {
        result = await userService().getUsers();
    } catch (error) {
        return res.status(400).send(error);
    }
        return res.status(200).send(result);
    
});


module.exports = router;
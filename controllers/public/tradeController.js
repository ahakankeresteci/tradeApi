const router = require('express').Router();
const _ = require('lodash');
const tradeService = require('../../services/tradeService');

router.get('/board', async (req, res) => {
    let result;
    try {
        result = await tradeService().getBoard();
    } catch (error) {
        return res.status(400).send(error);
    }
        return res.status(200).send(result);
});

router.post('/sell', async (req, res) => {
    let result;
    try {
        result = await tradeService().createSellTradeRequest(req.body);
    } catch (error) {
        return res.status(400).send(error);
    }
        return res.status(200).send(result);
});

router.post('/buy', async (req, res) => {
    let result;

    try {
        result = await tradeService().createBuyTradeRequest(req.body);
    } catch (error) {
        return res.status(400).send(error);
    }
        return res.status(200).send(result);
});

router.get('/transactions', async (req, res) => {
    let result;
    try {
        result = await tradeService().getTransactions();
    } catch (error) {
        return res.status(400).send(error);
    }
        return res.status(200).send(result);
});

module.exports = router;
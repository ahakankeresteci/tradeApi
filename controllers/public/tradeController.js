const router = require('express').Router();
const _ = require('lodash');
const tradeService = require('../../services/tradeService');

router.get('/board', async (req, res) => {
    let result;
    try {
        result = await tradeService().getBoard();
    } catch (error) {
        return res.status(400).send(error.message);
    }
        return res.status(200).send(result);
});

router.post('/sell', async (req, res) => {
    let result;
    try {
        result = await tradeService().createSellTradeRequest(req.body);
    } catch (error) {
        return res.status(400).send(error.message);
    }
        return res.status(200).send(result);
});

router.post('/buy', async (req, res) => {
    let result;

    try {
        result = await tradeService().createBuyTradeRequest(req.body);
    } catch (error) {
        return res.status(400).send(error.message);
    }
        return res.status(200).send(result);
});

router.get('/transactions', async (req, res) => {
    let result;
    try {
        result = await tradeService().getTransactions();
    } catch (error) {
        return res.status(400).send(error.message);
    }
        return res.status(200).send(result);
});

router.put('/update/:id', async (req, res) => {
    let result;
    try {
        result = await tradeService().updateTradeRequest(req.params.id ,req.body);
    } catch (error) {
        return res.status(400).send(error.message);
    }
        return res.status(200).send(result);
});

router.put('/:id', async (req, res) => {
    let result;
    try {
        result = await tradeService().deleteTradeRequest(req.params.id);
    } catch (error) {
        return res.status(400).send(error.message);
    }
        return res.sendStatus(200);
});

module.exports = router;
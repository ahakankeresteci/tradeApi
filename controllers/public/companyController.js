const router = require('express').Router();
const companyService = require('../../services/companyService');

router.post('/',async (req, res) => {
    let result;
    try {
        result = await companyService().bulkCreateCompany(req.body.companies);
    } catch (error) {
        return res.status(400).send(error);
    }
        return res.status(200).send(result);
});

module.exports = router;
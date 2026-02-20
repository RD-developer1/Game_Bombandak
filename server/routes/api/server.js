const express = require("express");
const router = express.Router();
const serverModule = require("../../modules/server/serverController");

/**
 * @route POST api/auction/auction
 * @description Auction nft
 * @access Public
 */
router.post("/check", serverModule.CheckStatus);

module.exports = router;
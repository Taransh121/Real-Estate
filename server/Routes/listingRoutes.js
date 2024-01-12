import express from 'express';
const router = express.Router();
import { createListing, deleteListing, getListing, getListings, updateListing } from '../Controller/listingController.js';
import { verifyToken } from '../Utils/verifyUser.js';

router.post("/create", verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);

export default router;

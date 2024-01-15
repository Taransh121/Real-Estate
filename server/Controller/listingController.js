import Listing from "../Models/listingModel.js";
import { errorHandler } from "../Utils/error.js";

export const createListing = async (req, res, next) => {
    try {
        const newListing = new Listing(req.body);
        const savedListing = await newListing.save();
        return res.status(201).json(savedListing);
    } catch (error) {
        next(error);
    }
}

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(errorHandler(404, 'Listing not found!'));
    }

    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, 'You can only delete your own listings!'));
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Listing has been deleted!');
    } catch (error) {
        next(error);
    }
}

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(errorHandler(404, 'Listing not found!'));
    }

    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, 'You can only update your own listings!'));
    }
    try {
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedListing);
    } catch (error) {
        next(error);
    }
}

export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, 'Listing not found!'));
        }
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
}

// export const getListings = async (req, res, next) => {
//     try {
//         const limit = parseInt(req.query.limit) || 9;
//         const startIndex = parseInt(req.query.startIndex) || 0;
//         //if offer is not selected it means that it is either undefined(not chosen by user) or it is unselected(offer as false by user), in both the cases we want to search in all the listings wiht and without offer. Same goes for parking and furnished.
//         // And if the type is undefined or selected as ALL it means we wanna see all the listings(rent+sale).
//         let offer = req.query.offer;
//         if (offer === undefined || offer === "false") {
//             offer = { $in: [false, true] };
//         }
//         let furnished = req.query.offer;
//         if (furnished === undefined || furnished === "false") {
//             furnished = { $in: [false, true] };
//         }
//         let parking = req.query.offer;
//         if (parking === undefined || parking === "false") {
//             parking = { $in: [false, true] };
//         }
//         let type = req.query.type;
//         if (type === undefined || type === "all") {
//             type = { $in: ["sale", "rent"] };
//         }

//         const searchTerm = req.query.searchTerm || '';
//         //if the sorting is given by user use it ie: oldest,lates. if not given by user then initially it is sorted as latest and descending.
//         const sort = req.query.sort || 'createdAt';
//         const order = req.query.order || 'desc';
//         //regex is a built in function for searching in MongoDB. I means that if we are searching for modern it will search everywhere, it can be some part of the word as well. options:'i' means that it can be lowercase and uppercase.
//         const listings = await Listing.find({
//             name: { $regex: searchTerm, $options: 'i' },
//             offer,
//             furnished,
//             parking,
//             type
//         }).sort(
//             { [sort]: order }
//         ).limit(limit).skip(startIndex);
//         return res.status(200).json(listings);
//     } catch (error) {
//         next(error);
//     }
// }

export const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer;

        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] };
        }

        let furnished = req.query.furnished;

        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true] };
        }

        let parking = req.query.parking;

        if (parking === undefined || parking === 'false') {
            parking = { $in: [false, true] };
        }

        let type = req.query.type;

        if (type === undefined || type === 'all') {
            type = { $in: ['sale', 'rent'] };
        }

        const searchTerm = req.query.searchTerm || '';

        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || 'desc';

        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            type,
        })
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);

        return res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
};
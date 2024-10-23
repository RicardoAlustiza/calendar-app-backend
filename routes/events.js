/*
    This file is used to define the routes for the calendar evets.
    host + /api/events
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { isDate } = require('../helpers/isDate');
const { fieldValidators } = require('../middlewares/fieldValidators');
const { jwtValidators } = require('../middlewares/jwtValidators');
const { getEvents, createNewEvent, updateEvent, deleteEvent } = require('../controllers/events');

const router = Router();

// All routes must be validated with the JWT
router.use(jwtValidators);

router.get('/', getEvents);

router.post(
    '/',
    [
        check('title', 'Title is required').not().isEmpty(),
        check('start', 'Start date is required').custom(isDate),
        check('end', 'End date is required').custom(isDate),
        fieldValidators
    ],
    createNewEvent
);

router.put(
    '/:id',
    [
        check('title', 'Title is required').not().isEmpty(),
        check('start', 'Start date is required').custom(isDate),
        check('end', 'End date is required').custom(isDate),
        fieldValidators
    ],
    updateEvent
);

router.delete('/:id', deleteEvent);

module.exports = router;
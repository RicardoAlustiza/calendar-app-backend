const { response } = require('express');
const Event = require('../models/Event');

const getEvents = async(req, res=response) => {

    const events = await Event.find().populate('user', 'name');

    res.json({
        ok: true,
        events
    });
}

const createNewEvent = async(req, res=response) => {

    const event = new Event(req.body);

    try {

        event.user = req.uid;
        const eventSaved = await event.save();

        res.json({
            ok: true,
            event: eventSaved
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
}

const updateEvent = async(req, res=response) => {

    const eventId = req.params.id;

    try{

        const event = await Event.findById(eventId);

        if(!event){
            return res.status(404).json({
                ok: false,
                msg: 'Event not found'
            });
        }

        if(event.user.toString() !== req.uid){
            return res.status(401).json({
                ok: false,
                msg: 'You do not have the necessary permissions'
            });
        }

        const newEvent = {
            ...req.body,
            user: req.uid
        }

        const eventUpdated = await Event.findByIdAndUpdate(eventId, newEvent, {new: true});

        res.json({
            ok: true,
            event: eventUpdated
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
}

const deleteEvent = async(req, res=response) => {

    const eventId = req.params.id;

    try{
        const event = await Event.findById(eventId);

        if(!event){
            return res.status(404).json({
                ok: false,
                msg: 'Event not found'
            });
        }

        if(event.user.toString() !== req.uid){
            return res.status(401).json({
                ok: false,
                msg: 'You do not have the necessary permissions'
            });
        }

        await Event.findByIdAndDelete(eventId);

        res.json({ok: true});

    } catch(error){
        res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
}

module.exports = {
    getEvents,
    createNewEvent,
    updateEvent,
    deleteEvent
}
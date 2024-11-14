module.exports = (adminModel, DataModel, key) => {
    const route = require('express').Router();
    const cron = require('node-cron');

    route.get('/', async(req, res) => {
        const contacts = await DataModel.findOne({}, { contact: 1, _id: 0 });
        if(contacts?.length !== 0) {
            res.send({status : 200, type : 'contact', result : contacts})
        }
    })

    route.post('/', async (req, res) => {
        try {
            const { time, email, name, message } = req.body;
    
            // Define the new contact entry
            const newContact = {
                name,
                email,
                message,
                time,
                status: 'unseen',
            };
    
            // Update the document by pushing the new contact to the `contact` array
            const result = await DataModel.updateOne(
                {}, // Match criteria, leave empty to update the first document in the collection
                { $push: { contact: newContact } }
            );
    
            if (result.modifiedCount > 0) {
                res.status(200).send({ status : 200, type : 'postcontact', message: 'Contact added successfully.' });
            } else {
                res.status(400).json({ message: 'Failed to add contact.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An error occurred.', error });
        }
    });

    route.put('/:id', async (req, res) => {
        const { id } = req.params; // Get the unique ID from request body
    
        if (!id) {
            return res.status(400).json({ error: 'ID is required to update status' });
        }
    
        try {
            const result = await DataModel.updateOne(
                { 'contact._id': id }, // Find document containing contact with matching ID
                { $set: { 'contact.$.status': 'seen' } } // Update the status of the matched contact to "seen"
            );
    
            if (result.nModified === 0) {
                return res.status(404).json({ error: 'Contact not found or already marked as seen' });
            }
    
            res.send({ status : 200, type : 'updatecontact', message: 'Contact status updated to seen', result });
        } catch (error) {
            console.error('Error updating contact status:', error);
            res.status(500).json({ error: 'An error occurred while updating the contact status' });
        }
    });

    route.post('/bulk', async (req, res) => {
        const { ids } = req.body; // Array of unique IDs
    
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'Invalid or empty array of IDs.' });
        }
    
        try {
            // Find the document (assuming there's only one document to work with)
            const document = await DataModel.findOne({});
    
            if (!document) {
                return res.status(404).json({ message: 'Document not found.' });
            }
    
            // Filter out contacts that match any of the IDs in the array
            const updatedContacts = document.contact.filter(
                (contact) => !ids.includes(contact._id.toString())
            );
    
            // Update the document with the filtered contacts
            document.contact = updatedContacts;
            await document.save();
    
            res.status(200).json({ status: 200, type: 'deletebulkcontact', message: 'Contacts deleted successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An error occurred.', error });
        }
    });

    route.delete('/:id', async (req, res) => {
        const { id } = req.params;
    
        try {
            // Find the document (we assume there's only one document for simplicity)
            const document = await DataModel.findOne({});
    
            if (!document) {
                return res.status(404).json({ message: 'Document not found.' });
            }
    
            // Filter out the contact with the specified ID
            const updatedContacts = document.contact.filter(
                (contact) => contact._id.toString() !== id
            );
    
            // Update the document with the filtered contacts
            document.contact = updatedContacts;
            await document.save();
    
            res.status(200).json({ status: 200, type: 'deletecontact', message: 'Contact deleted successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An error occurred.', error });
        }
    });
    
    // Delete contacts older than a specified number of days (15 days here)
    const deleteExpiredContacts = async () => {
        const days = 15;
        const dateThreshold = new Date();
        dateThreshold.setDate(dateThreshold.getDate() - days);

        try {
            const result = await DataModel.updateOne(
                {}, // Assuming a single document
                { $pull: { contact: { time: { $lt: dateThreshold } } } }
            );

            console.log(`${result.modifiedCount} expired contacts deleted.`);
        } catch (error) {
            console.error('Error deleting expired contacts:', error);
        }
    };

    // Schedule the deleteExpiredContacts function to run every day at midnight
    cron.schedule('0 0 * * *', () => {
        // console.log('Running daily contact cleanup job...');
        deleteExpiredContacts();
    });



    return route
}
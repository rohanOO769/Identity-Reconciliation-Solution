// pages/api/identify.js

import { sequelize, Contact } from '../../models/contact';
import { Op } from 'sequelize';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, phoneNumber } = req.body;

  try {
    // Find contacts with matching email or phone number
    const contacts = await Contact.findAll({
      where: {
        [Op.or]: [
          { email },
          { phoneNumber },
        ],
      },
    });

    let primaryContact = null;
    let secondaryContacts = [];

    if (contacts.length > 0) {
      // Identify primary and secondary contacts
      primaryContact = contacts.find(contact => contact.linkPrecedence === 'primary');
      secondaryContacts = contacts.filter(contact => contact.linkPrecedence === 'secondary');

      if (!primaryContact) {
        primaryContact = contacts[0];
        primaryContact.linkPrecedence = 'primary';
        await primaryContact.save();
      }

      for (const contact of contacts) {
        if (contact.id !== primaryContact.id) {
          contact.linkedId = primaryContact.id;
          contact.linkPrecedence = 'secondary';
          await contact.save();
        }
      }
    } else {
      // Create a new primary contact if none exist
      primaryContact = await Contact.create({ email, phoneNumber, linkPrecedence: 'primary' });
    }

    const response = {
      contact: {
        primaryContactId: primaryContact.id,
        emails: [primaryContact.email, ...secondaryContacts.map(contact => contact.email)].filter(Boolean),
        phoneNumbers: [primaryContact.phoneNumber, ...secondaryContacts.map(contact => contact.phoneNumber)].filter(Boolean),
        secondaryContactIds: secondaryContacts.map(contact => contact.id),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error identifying contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

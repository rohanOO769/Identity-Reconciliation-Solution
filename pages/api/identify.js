// pages/api/identify.js

import sequelize from '../../models/contact'; // Adjust path as per your project structure
import { QueryTypes } from 'sequelize';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { Email, phoneNumber } = req.body;

  try {
    // Query database to find primary and secondary contacts
    const sqlQuery = `
        SELECT id, phone_number, email, linked_id , link_precedence
        FROM contacts
        WHERE deleted_at IS NULL
            AND (Email = :contacts.email OR phoneNumber = :contacts.phone_umber)
        ORDER BY created_at ASC;
        `;


    const contacts = await sequelize.query(sqlQuery, {
      type: QueryTypes.SELECT,
      replacements: {
        Email,
        phoneNumber,
      },
    });

    // Organize contacts into primary and secondary
    const primaryContact = contacts.find(contact => contact.linkprecedence === 'primary') || null;
    const secondaryContacts = contacts.filter(contact => contact.linkprecedence === 'secondary');

    // Prepare response
    const response = {
      contact: {
        primaryContactId: primaryContact ? primaryContact.id : null,
        emails: primaryContact ? [primaryContact.email] : [],
        phoneNumbers: primaryContact ? [primaryContact.phonenumber] : [],
        secondaryContactIds: secondaryContacts.map(contact => contact.id),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error identifying contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    // Ensure Sequelize connection is closed
    await sequelize.close();
  }
}

'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Contact } from '@/types/index';
import { useAuthStore } from '@/store/authStore';
import { decodeAccessToken } from '@/utils/decodeAccessToken';
import { getAllContacts, answerContact } from '@/services/contact/api';
import { toast } from 'react-toastify';

export default function ContactAdminPage() {
  const { accessToken } = useAuthStore();
  const user = decodeAccessToken(accessToken);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [responseMessage, setResponseMessage] = useState('');

  const fetchContacts = async () => {
    try {
      const response = await getAllContacts();
      if (response.status !== 200) {
        console.error('Failed to fetch contacts');
        return;
      }
      setContacts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleOpenPopup = (contact: Contact) => {
    setSelectedContact(contact);
    setResponseMessage('');
    setOpen(true);
  };

  const handleSendContact = async () => {
    if (!selectedContact) return;

    try {
      const response = await answerContact(selectedContact.id.toString(), {
        responseMessage,
        adminEmail: user?.email,
      });
      if (response.status !== 200) {
        toast.error('Failed to send contact');
        return;
      }
      toast.success('Contact response sent successfully!');
      setOpen(false);
      fetchContacts();
    } catch (error) {
      console.error(error);
      toast.error('Failed to send contact');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto ml-64 max-w-5xl p-6"
    >
      <h1 className="mb-4 text-2xl font-bold">Contact Management</h1>
      <div className="overflow-hidden rounded-lg bg-white shadow-lg">
        <table className="w-full min-w-full border-collapse">
          <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Message</th>
              <th className="p-3 text-left">Created At</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <motion.tr
                key={contact.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b text-gray-800 transition duration-200 hover:bg-gray-50"
              >
                <td className="p-3">{contact.name}</td>
                <td className="p-3">{contact.email}</td>
                <td className="p-3">{contact.message}</td>
                <td className="p-3">
                  {new Date(contact.createdAt).toLocaleString()}
                </td>
                <td className="p-3">
                  {contact.isResponded ? (
                    <CheckCircle className="text-green-500" />
                  ) : (
                    <span className="text-red-500">Pending</span>
                  )}
                </td>
                <td className="p-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOpenPopup(contact)}
                    disabled={contact.isResponded}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-white transition duration-300 ${contact.isResponded ? 'cursor-not-allowed bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                  >
                    <Send size={16} /> Send Contact
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Respond to Contact
            </h2>
            <textarea
              className="w-full rounded-md border p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your response..."
              value={responseMessage}
              onChange={e => setResponseMessage(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="rounded-md bg-gray-500 px-4 py-2 text-white"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-blue-500 px-4 py-2 text-white"
                onClick={handleSendContact}
                disabled={!responseMessage.trim()}
              >
                Send Response
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

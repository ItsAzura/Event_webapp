'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      className="ml-64 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8"
    >
      <motion.h1
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        className="mb-8 text-3xl font-bold text-white"
      >
        Contact{' '}
        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Management
        </span>
      </motion.h1>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-gray-900/30 backdrop-blur-lg">
        <table className="w-full">
          <thead className="border-b border-white/10 bg-gray-800/20">
            <tr>
              {[
                'Name',
                'Email',
                'Message',
                'Created At',
                'Status',
                'Action',
              ].map((header, index) => (
                <th
                  key={index}
                  className="p-4 text-left text-sm font-semibold text-purple-400"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {contacts.map((contact, index) => (
                <motion.tr
                  key={contact.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/10 text-gray-300 transition-colors hover:bg-gray-800/20"
                >
                  <td className="p-4">{contact.name}</td>
                  <td className="p-4">{contact.email}</td>
                  <td className="max-w-xs truncate p-4">{contact.message}</td>
                  <td className="p-4">
                    {new Date(contact.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4">
                    {contact.isResponded ? (
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm">Responded</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-yellow-400">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
                        <span className="text-sm">Pending</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleOpenPopup(contact)}
                      disabled={contact.isResponded}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                        contact.isResponded
                          ? 'cursor-not-allowed bg-gray-700/50 text-gray-500'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-blue-500/30'
                      }`}
                    >
                      <Send size={16} /> Respond
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="w-full max-w-2xl rounded-2xl border border-white/10 bg-gray-900/50 p-6 backdrop-blur-lg"
            >
              <h2 className="mb-6 text-2xl font-bold text-white">
                Respond to Contact
              </h2>

              <div className="space-y-4">
                <div className="rounded-xl bg-gray-800/50 p-4">
                  <p className="text-sm text-gray-400">Original Message</p>
                  <p className="mt-2 text-gray-300">
                    {selectedContact?.message}
                  </p>
                </div>

                <textarea
                  className="w-full rounded-xl border border-white/10 bg-gray-800/50 p-4 text-white backdrop-blur-lg placeholder:text-gray-500 focus:border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  placeholder="Type your response..."
                  rows={5}
                  value={responseMessage}
                  onChange={e => setResponseMessage(e.target.value)}
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-xl border border-white/10 bg-white/5 px-6 py-2 text-white backdrop-blur-lg transition-all hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2 text-white shadow-lg transition-all hover:shadow-blue-500/30 disabled:opacity-50"
                  onClick={handleSendContact}
                  disabled={!responseMessage.trim()}
                >
                  Send Response
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

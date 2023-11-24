import { HttpError } from "../helpers/index.js"; 
import { ctrlWrapper } from "../decorator/ctrlWrapper.js";
import { Contact } from "../models/Contact.js";

const getAllContacts = async (req, res) => {
  const allContactsList = await Contact.find({});
  res.json(allContactsList);
}

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contactById = await Contact.findById(contactId);
  if (!contactById) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json(contactById)
}

const addContact = async (req, res) => {
  const newContact = await Contact.create(req.body);
  res.status(201).json(newContact);
}

const updateById = async (req, res) => {
  const { contactId } = req.params;
  const updateContact = await Contact.findByIdAndUpdate(contactId, req.body)
  if (!updateContact) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json(updateContact);
}

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const updateContact = await Contact.findByIdAndUpdate(contactId, req.body)
  if (!updateContact) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json(updateContact);
}

const deleteById = async (req, res) => {
  const { contactId } = req.params;
  const removeContact = await Contact.findByIdAndDelete(contactId)
  if (!removeContact) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json({ message: "Deleted success" });
}

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
  updateStatusContact: ctrlWrapper(updateStatusContact)
};
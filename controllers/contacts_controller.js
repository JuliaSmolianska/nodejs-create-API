import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorator/ctrlWrapper.js";
import { Contact } from "../models/Contact.js";

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const allContactsList = await Contact.find({ owner }, "-createdAt -updatedAt", { skip, limit }).populate("owner", "email");
  res.json(allContactsList);
}

const getFavoriteContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { favorite } = req.query;
  const skip = (page - 1) * limit;
  const favoriteContactsList = await Contact.find({ favorite }, "-createdAt -updatedAt", { skip, limit }).populate("owner", "email");
  res.json(favoriteContactsList);
}

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const contactById = await Contact.findOne({ _id: contactId, owner });
  if (!contactById) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json(contactById)
}

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const newContact = await Contact.create({ ...req.body, owner });
  res.status(201).json(newContact);
}

const updateById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const updateContact = await Contact.findOneAndUpdate({ _id: contactId, owner }, req.body)
  if (!updateContact) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json(updateContact);
}

const deleteById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const removeContact = await Contact.findOneAndDelete({ _id: contactId, owner })
  if (!removeContact) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json({ message: "Deleted success" });
}


const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const updateContact = await Contact.findOneAndUpdate({ _id: contactId, owner }, req.body)
  if (!updateContact) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json(updateContact);
}


export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getFavoriteContacts: ctrlWrapper(getFavoriteContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
  updateStatusContact: ctrlWrapper(updateStatusContact)
};
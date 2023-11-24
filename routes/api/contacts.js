import express from "express";
import contactsController from "../../controllers/contacts_controller.js";
import { isEmptyBody } from "../../middlewares/isEmptyBody.js";
import { isValidId } from "../../middlewares/isValidId.js";
import { validateBody } from "../../decorator/ValidateBody.js";
import { addContactSchema, updateContactSchema, updateFavoriteSchema } from "../../models/Contact.js"

const contactsRouter = express.Router();

contactsRouter.get('/', contactsController.getAllContacts);

contactsRouter.get('/:contactId', isValidId, contactsController.getContactById);

contactsRouter.post('/', isEmptyBody, validateBody(addContactSchema), contactsController.addContact);

contactsRouter.put('/:contactId', isValidId, isEmptyBody, validateBody(updateContactSchema), contactsController.updateById);

contactsRouter.patch('/:contactId/favorite', isValidId, isEmptyBody, validateBody(updateFavoriteSchema), contactsController.updateById);

contactsRouter.delete('/:contactId', isValidId, contactsController.deleteById)

export default contactsRouter;

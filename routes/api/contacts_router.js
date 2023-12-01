import express from "express";
import contactsController from "../../controllers/contacts_controller.js";
import { isEmptyBody, isEmptyBodyFavorite } from "../../middlewares/isEmptyBody.js";
import { isValidId } from "../../middlewares/isValidId.js";
import { validateBody } from "../../decorator/validateBody.js";
import { addContactSchema, updateContactSchema, updateFavoriteSchema } from "../../models/Contact.js"
import authenticate from "../../models/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', contactsController.getAllContacts);

contactsRouter.get('/:contactId', isValidId, contactsController.getContactById);

contactsRouter.post('/', isEmptyBody, validateBody(addContactSchema), contactsController.addContact);

contactsRouter.put('/:contactId', isValidId, isEmptyBody, validateBody(updateContactSchema), contactsController.updateById);

contactsRouter.patch('/:contactId/favorite', isValidId, isEmptyBodyFavorite, validateBody(updateFavoriteSchema), contactsController.updateStatusContact);

contactsRouter.delete('/:contactId', isValidId, contactsController.deleteById)

export default contactsRouter;

import React, {
  useState,
  useEffect,
  useContext,
  FunctionComponent,
} from "react";
import { ContactForm } from "./ContactForm";
import { ContactContext } from "./ContactContext";
import { useNavigate, useParams } from "react-router-dom";

export const ContactEdit: FunctionComponent = () => {
  const [contact, setContact] = useState<any>();
  const { getContactById, editContact } = useContext(ContactContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const onSubmit = (values: any) => {
    editContact(id!, values.name, values.description);
    navigate(`/contacts/${id}`);
  };

  const handleFetch = async () => {
    const newContact = await getContactById(id!);
    setContact(newContact);
  };

  useEffect(() => {
    handleFetch();
  }, []);

  // no form shall be rendered until there's a contact, ready
  if (!contact) return null;

  return <ContactForm defaultValues={contact} onSubmit={onSubmit} />;
};

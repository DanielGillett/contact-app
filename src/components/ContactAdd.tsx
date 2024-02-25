import React, { FunctionComponent, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ContactContext } from "./ContactContext";

import { ContactForm } from "./ContactForm";

export const ContactAdd: FunctionComponent = () => {
  const { addContact } = useContext(ContactContext);
  const navigate = useNavigate();
  const onSubmit = async (values: any) => {
    const id = await addContact(values.name, values.description);
    navigate(`/contacts/${id}`);
  };
  return <ContactForm onSubmit={onSubmit} />;
};

import React, {
  PropsWithChildren,
  FunctionComponent,
  createContext,
  useEffect,
  useState,
} from "react";
import {
  doc,
  query,
  where,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  collection,
  serverTimestamp,
  limit,
  getCountFromServer,
  startAfter,
  orderBy,
} from "firebase/firestore";
import { db } from "../utils/firebase";

interface IContact {
  id: string;
  name: string;
  description: string;
}

interface IContactContext {
  total: number;
  contacts: any[];
  handleFetch: (loadOneMore: boolean) => Promise<void>;
  setSearch: (search: string) => void;
  addContact: (name: string, description: string) => Promise<string>;
  editContact: (id: string, name: string, description: string) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  getContactById: (id: string) => Promise<IContact | undefined>;
}

export const ContactContext = createContext<IContactContext>({
  total: 0,
  contacts: [],
  setSearch: () => {},
  addContact: () => new Promise((resolve) => resolve("")),
  editContact: () => new Promise((resolve) => resolve()),
  handleFetch: () => new Promise((resolve) => resolve()),
  deleteContact: () => new Promise((resolve) => resolve()),
  getContactById: () => new Promise((resolve) => resolve(undefined)),
});

export const ContactProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [contacts, setContacts] = useState<any[]>([]);

  const getContactById = async (id: string) => {
    const docRef = doc(db, "contacts", id);
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) return;

    return docSnapshot.data() as IContact;
  };

  const addContact = async (
    name: string,
    description: string
  ): Promise<string> => {
    const contactRef = await addDoc(collection(db, "contacts"), {
      name,
      description,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return contactRef.id;
  };

  const editContact = async (
    id: string,
    name: string,
    description: string
  ): Promise<void> => {
    const contactRef = doc(db, "contacts", id);

    await updateDoc(contactRef, {
      name,
      description,
      updatedAt: serverTimestamp(),
    });
  };

  const deleteContact = async (id: string) => {
    const contactRef = doc(db, "contact", id);
    await deleteDoc(contactRef);
  };

  const handleFetch = async (loadOneMore?: boolean) => {
    const contactsCollectionRef = collection(db, "contacts");

    const pagination = loadOneMore
      ? [startAfter(contacts[contacts.length - 1])]
      : [];

    const filter = [
      where("name", ">=", search),
      where("name", "<=", search + "\uf8ff"),
      ...pagination,
    ];

    const contactQuery = query(
      contactsCollectionRef,
      ...filter,
      orderBy("name"),
      limit(1)
    );
    const contactCount = query(contactsCollectionRef, ...filter);
    const totalCount = await getCountFromServer(contactCount);
    const docsSnapshot = await getDocs(contactQuery);

    setContacts(
      loadOneMore ? [...contacts, ...docsSnapshot.docs] : docsSnapshot.docs
    );
    setTotal(totalCount.data().count - docsSnapshot.size);
  };

  useEffect(() => {
    handleFetch();
  }, [search]);

  return (
    <ContactContext.Provider
      value={{
        total,
        contacts,
        setSearch,
        addContact,
        editContact,
        handleFetch,
        deleteContact,
        getContactById,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};

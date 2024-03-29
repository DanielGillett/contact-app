import React, {
  PropsWithChildren,
  FunctionComponent,
  createContext,
  useEffect,
  useState,
  useContext,
} from "react";
import {
  doc,
  query,
  limit,
  where,
  addDoc,
  getDoc,
  getDocs,
  orderBy,
  deleteDoc,
  updateDoc,
  collection,
  startAfter,
  serverTimestamp,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { AuthContext } from "./AuthContext";

interface IContact {
  id: string;
  name: string;
  description: string;
}

interface IContactContext {
  total: number;
  contacts: any[];
  setSearch: (search: string) => void;
  addContact: (name: string, description: string) => Promise<string>;
  editContact: (id: string, name: string, description: string) => Promise<void>;
  handleFetch: (loadOneMore: boolean) => Promise<void>;
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
  const { user } = useContext(AuthContext);
  const collectionName = `users/${user!.uid}/contacts`; // <-- User will not be null

  const getContactById = async (id: string) => {
    const docRef = doc(db, collectionName, id);
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) return;

    return docSnapshot.data() as IContact;
  };

  const addContact = async (
    name: string,
    description: string
  ): Promise<string> => {
    const contactRef = await addDoc(collection(db, collectionName), {
      name,
      description,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    handleFetch();
    return contactRef.id;
  };

  const editContact = async (
    id: string,
    name: string,
    description: string
  ): Promise<void> => {
    const contactRef = doc(db, collectionName, id);

    await updateDoc(contactRef, {
      name,
      description,
      updatedAt: serverTimestamp(),
    });

    handleFetch();
  };

  const deleteContact = async (id: string) => {
    const contactRef = doc(db, collectionName, id);
    await deleteDoc(contactRef);
    handleFetch();
  };

  const handleFetch = async (loadOneMore?: boolean) => {
    const contactsCollectionRef = collection(db, collectionName);

    const pagination = loadOneMore
      ? [startAfter(contacts[contacts.length - 1])]
      : [];

    const filter = [
      where("name", ">=", search),
      where("name", "<=", search + "\uf8ff"),
      orderBy("name"),
      ...pagination,
    ];

    const contactQuery = query(contactsCollectionRef, ...filter, limit(1));
    const totalCount = await getCountFromServer(contactsCollectionRef);
    const docsSnapshot = await getDocs(contactQuery);

    setContacts(
      loadOneMore ? [...contacts, ...docsSnapshot.docs] : docsSnapshot.docs
    );
    setTotal(totalCount.data().count - contacts.length - 1);
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

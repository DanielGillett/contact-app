import React, {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, db } from "../utils/firebase";
import { FcGoogle } from "react-icons/fc";
import { Button, Center, Text } from "@chakra-ui/react";
import { doc, setDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();

interface IAuthContextProps {
  user?: User;
}
export const AuthContext = createContext<IAuthContextProps>({});

export const AuthProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [user, setUser] = useState<User>();
  const handleSignInWithGoogle = () => {
    signInWithPopup(auth, provider);
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const { uid, email, displayName } = user;
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        email,
        displayName,
      });
      setUser(user);
    });
  }, []);

  return user ? (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  ) : (
    <Center p={8}>
      <Button
        w={"full"}
        maxW={"md"}
        variant={"outline"}
        leftIcon={<FcGoogle />}
        onClick={handleSignInWithGoogle}
      >
        <Center>
          <Text>Sign in with Google</Text>
        </Center>
      </Button>
    </Center>
  );
};

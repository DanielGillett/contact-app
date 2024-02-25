import {
  Input,
  Button,
  VStack,
  FormLabel,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ContactContext } from "./ContactContext";
import React, { FunctionComponent, useContext } from "react";

interface IContactForm {
  onSubmit: (values: any) => void;
  defaultValues?: {
    name: string;
    description: string;
  };
}

export const ContactForm: FunctionComponent<IContactForm> = ({
  defaultValues,
  onSubmit,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ defaultValues: defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack gap={2}>
        <FormControl isRequired>
          <FormLabel>First name</FormLabel>
          <Input
            placeholder="first name"
            {...register("name", {
              required: "This is required",
            })}
          />
          <FormErrorMessage>
            {errors?.name?.message?.toString()}
          </FormErrorMessage>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Description</FormLabel>
          <Input
            placeholder="description"
            {...register("description", {
              required: "This is required",
            })}
          />
          <FormErrorMessage>
            {errors?.description?.message?.toString()}
          </FormErrorMessage>
        </FormControl>
        <Button colorScheme="blue" size="lg" width="100%" type="submit">
          Submit
        </Button>
      </VStack>
    </form>
  );
};

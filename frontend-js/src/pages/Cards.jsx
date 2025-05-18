import React, { useState } from "react";
import {useQuery, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import FlashcardFormModal from "../components/Flashcard/FlashcardFormModal";
import { toast } from "react-hot-toast";
import SearchBar from "../components/Flashcard/SearchBar";
import PaginatedFlashcards from "../components/Flashcard/PaginatedFlashcards";
import { GET_CARDS } from "../graphql/queries/cardQueries";

import {
  CREATE_FLASHCARD,
  UPDATE_FLASHCARD,
} from "../graphql/mutations/cardMutations";

export default function Cards() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [createFlashcard] = useMutation(CREATE_FLASHCARD);
  const [updateFlashcard] = useMutation(UPDATE_FLASHCARD);
  const [searchTerm, setSearchTerm] = useState("");

  const {  refetch } = useQuery(GET_CARDS, {
  variables: { page: 1, limit: 12 },
});


  //handle form submission (add/edit)
  const handleFormSubmit = async (formData) => {
    try {
      if (editingCard) {
        // UPDATE
        await updateFlashcard({
          variables: {
            id: editingCard.id,
            ...formData,
          },
        });

        await refetch();//Refresh the data after editing the card.

        toast.success("Flashcard updated!"); // show toast
      } else {
        // CREATE
        await createFlashcard({
          variables: formData,
        });

        await refetch();//Refresh the data after adding the card.
        
        toast.success("Flashcard added successfully!"); // sow toast
      }

      //Clearing and closing the modal
      setEditingCard(null);
      setModalOpen(false);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Something went wrong!"); // error toast
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">VerbPro C1</h1>
        <div className="space-x-4">
          <Link to="/" className="text-gray-700 hover:text-blue-500">
            Home
          </Link>
          <Link to="/cards" className="text-gray-700 hover:text-blue-500">
            Cards
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-8">
        <h2 className="text-2xl font-semibold mb-4">Flashcards</h2>

        <SearchBar onSearch={(term) => setSearchTerm(term)} />

        {/*  add new button */}
        <button
          onClick={() => {
            setModalOpen(true);
            setEditingCard(null);
          }}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {" "}
          ➕ Add New Flashcard
        </button>

        {/* Paginated List */}
        <PaginatedFlashcards
          searchTerm={searchTerm}
          setEditingCard={setEditingCard}
          setModalOpen={setModalOpen}
          toast={toast}
          refetch={refetch}
        />

        {modalOpen && (
          <FlashcardFormModal
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setEditingCard(null);
            }}
            onSubmit={handleFormSubmit}
            initialData={editingCard}
          />
        )}
      </main>
    </div>
  );
}

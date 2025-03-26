'use client'
import React, { useState, Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { EditorState, convertFromRaw, ContentState } from 'draft-js';
import { RiStickyNoteAddFill } from 'react-icons/ri';
import { IoArrowBackOutline } from 'react-icons/io5';
import { FaRegSave, FaSave, FaSearch } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';

// Get API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL??'http://localhost:8000';

const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
    ssr: false,
    loading: () => <div className="border rounded-lg p-4 min-h-[200px]">Loading editor...</div>
});

const getPlainTextFromRawContent = (rawContent: string): string => {
    try {
        const parsedContent = JSON.parse(rawContent);
        const contentState = convertFromRaw(parsedContent);
        return contentState.getPlainText();
    } catch {
        return rawContent || '';
    }
};

const convertContentToEditorState = (content: string): EditorState => {
    try {
        const parsedContent = JSON.parse(content);
        const contentState = convertFromRaw(parsedContent);
        return EditorState.createWithContent(contentState);
    } catch {
        return EditorState.createWithContent(ContentState.createFromText(content || ''));
    }
};

interface Note {
    _id?: string; // added _id for MongoDB documents
    title: string;
    content: string;
    description: string;
    date: string;
    createdAt: string;
}

const Sidebar_MainContent: React.FC = () => {
    const [selectedNote, setSelectedNote] = useState<string | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('New Note');
    const [isLoading, setIsLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768); // Adjust the breakpoint as needed
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Fetch all notes
    const fetchNotes = async () => {
        try {
            const response = await fetch(`${API_URL}/api/todos`);
            const data = await response.json();
            setNotes(data.todos);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    // Save note changes
    const handleSaveChanges = async () => {
        try {
            setIsLoading(true);
            const noteData = {
                title: title,
                description: content,
                completed: false
            };

            if (selectedNote) {
                // Update existing note
                const response = await fetch(`${API_URL}/api/todos/${selectedNote}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(noteData),
                });
                if (!response.ok) throw new Error('Failed to update note');
            } else {
                // Create new note
                const response = await fetch(`${API_URL}/api/todos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(noteData),
                });
                if (!response.ok) throw new Error('Failed to create note');
            }

            // Refresh notes list
            await fetchNotes();
            alert('Note saved successfully!');
        } catch (error) {
            console.error('Error saving note:', error);
            alert('Failed to save note');
        } finally {
            setIsLoading(false);
        }
    };

    // Delete note
    const handleDeleteNote = async () => {
        if (!selectedNote || !confirm('Are you sure you want to delete this note?')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/todos/${selectedNote}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete note');

            setSelectedNote(null);
            setTitle('New Note');
            setContent('');
            setEditorState(EditorState.createEmpty());
            setIsEditorOpen(false);
            await fetchNotes();
            alert('Note Deleted successfully!');
        } catch (error) {
            console.error('Error deleting note:', error);
            alert('Failed to delete note');
        }
    };

    // Select note for editing
    const handleNoteSelect = async (noteId: string) => {
        try {
            const response = await fetch(`${API_URL}/api/todos/${noteId}`);
            const note = await response.json();
            setSelectedNote(noteId);
            setTitle(note.title);
            setContent(note.description || '');
            // Convert the content to EditorState
            setEditorState(convertContentToEditorState(note.description || ''));
            setIsEditorOpen(true);
        } catch (error) {
            console.error('Error fetching note details:', error);
        }
    };

    const handleContentChange = async (newContent: string) => {
        setContent(newContent);
        console.log(">>>>>>>>>newContent", newContent);
    };

    const handleNewNote = () => {
        setSelectedNote(null);
        setTitle('New Note');
        setContent('');
        setEditorState(EditorState.createEmpty());
        setIsEditorOpen(true);
    };

    const handleBack = () => {
        setSelectedNote(null);
        setTitle('New Note');
        setContent('');
        setEditorState(EditorState.createEmpty());
        setIsEditorOpen(false);
    };

    return (
        <div className="flex flex-row w-full h-auto">
            {/* Sidebar */}
            <div className="w-[401px] flex flex-col gap-4 p-4 border-r border-gray-200">
                {/* Top bar */}
                <div className="flex flex-row justify-between items-center mb-4">
                    <div 
                        className="flex flex-row items-center gap-2 px-4 py-3 bg-black rounded-lg cursor-pointer"
                        onClick={handleNewNote}
                    >
                        <RiStickyNoteAddFill width={20} height={20} />
                        <span className="text-white text-sm font-medium">New TODO</span>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                        <FaSearch fill='#000' width={24} height={24} />
                    </div>
                </div>

                {/* Notes List */}
                <div className="flex flex-col gap-4 overflow-y-auto">
                    {notes.map((note) => (
                        <div
                            key={note._id}
                            onClick={() => handleNoteSelect(note._id!)}
                            className={`flex flex-col gap-2 p-4 bg-white rounded-lg cursor-pointer hover:bg-gray-50 
                                ${selectedNote === note._id ? 'border-2 border-black' : 'border border-gray-200'}`}
                        >
                            <h3 className="text-lg font-semibold text-[#1b1b1b]">{note.title}</h3>
                            <div className="flex flex-row justify-between items-center">
                                <p className="text-sm text-[#000000cc] line-clamp-2">
                                    {getPlainTextFromRawContent(note.description)}
                                </p>
                                <span className="text-xs text-[#00000080]">
                                    {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            {isEditorOpen && (
                <div className={isMobile ? 'fixed inset-0 bg-white flex flex-col justify-center items-center z-50' : 'flex-1 p-8 bg-white overflow-y-auto'}>
                    <div className={isMobile ? 'w-full max-w-xl p-8 bg-white rounded-lg shadow-lg' : ''}>
                        {isMobile && (
                            <button onClick={handleBack} className="p-2 flex justify-center align-middle text-center text-3xl text-black hover:text-gray-700">
                                <IoArrowBackOutline width={24} height={24} /> Back
                            </button>
                        )}
                        <div className="flex justify-between items-center mb-4">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="text-4xl font-semibold text-[#1b1b1b] border-none outline-none"
                            />
                            <div className="flex gap-4">
                                <button
                                    onClick={handleSaveChanges}
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                                >
                                    {isLoading ? <FaRegSave width={24} height={24} /> : <FaSave width={24} height={24} />}
                                </button>
                                {selectedNote && (
                                    <button
                                        onClick={handleDeleteNote}
                                        className="p-2 text-red-600 hover:text-red-700 cursor-pointer"
                                    >
                                        <FaRegTrashCan width={24} height={24} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <Suspense fallback={<div className="border rounded-lg p-4 min-h-[200px]">Loading editor...</div>}>
                            <RichTextEditor
                                editorState={editorState}
                                setEditorState={setEditorState}
                                onContentChange={handleContentChange}
                            />
                        </Suspense>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar_MainContent;
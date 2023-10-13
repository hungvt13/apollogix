import { useState } from 'react';
import cloneDeep from 'lodash/fp/cloneDeep';

import Dialog from './components/Dialog/Dialog';
import Board, { GridType, GridDataType } from './components/Board/Board';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import './App.css'

const data = {
  titles: [{ id: 1, title: 'Todo'}, { id: 2, title: 'In Progress'}, { id: 3, title: 'Done'}],
  data: [[{ id: 1, title: 'What is Lorem Ipsum? What is Lorem Ipsum? What is Lorem Ipsum? What is Lorem Ipsum? What is Lorem Ipsum?', content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

  Why do we use it?
  It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
  
  
  Where does it come from?
  Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
  
  The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
  
  Where can I get some?
  There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.
  
  5
    paragraphs
    words
    bytes
    lists
    Start with 'Lorem
  ipsum dolor sit amet...'
  `}, { id: 2, title: 'Item 2', content: 'this is the content'}, { id: 3, title: 'Item 3', content: 'this is the content'}],
  [{ id: 4, title: 'Item 4', content: 'this is the content'}, { id: 5, title: 'Item 5', content: 'this is the content'}, { id: 6, title: 'Item 6', content: 'this is the content'}],
  [{ id: 7, title: 'Item 7', content: 'this is the content'}, { id: 8, title: 'Item 8', content: 'this is the content'}, { id: 9, title: 'Item 9', content: 'this is the content'}]]
};

const MAX_CHARACTERS_ALLOWED = 255;

const DEFAULT_ERROR_STATE = {
  title: '',
  content: ''
}

function App() {
  const [grid, setGrid] = useState<GridType>(data.data);
  const [editNote, setEditNote] = useState<{ item: GridDataType, row: number, col: number } | null >(null);
  const [errors, setErrors] = useState(cloneDeep(DEFAULT_ERROR_STATE));

  const titles = data.titles;

  const handleSetEdit = (data: { item: GridDataType, row: number, col: number }) => {
    setEditNote({
      ...data,
      item: { ...data.item }
    });
  };

  const handleEditClose = () => {
    setEditNote(null);
    setErrors(cloneDeep(DEFAULT_ERROR_STATE))
  };

  const handleEditSave = () => {
    if (editNote === null) return;
    if (validate() === false) return;

    const newGrid = cloneDeep(grid);
    newGrid[editNote.row][editNote.col] = editNote.item;
    setGrid(newGrid);
    handleEditClose();
  };

  const handleEditForm = (key: string, value: string) => {

    if (value.length >= MAX_CHARACTERS_ALLOWED) return;

    // clear error after user make changes 
    handleSetErrors(key, '');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setEditNote((prevState): any => ({
      ...prevState,
      item: {
        ...prevState?.item,
        [key]: value
      }
    }))
  };

  const handleSetErrors = (key: string, value: string) => {
    setErrors((prevState) => ({
      ...prevState,
      [key]: value
    }))
  };

  const validate = () : boolean => {
    let isValid = true;

    if (editNote === null) return true;

    if (editNote.item.title.length === 0) {
      handleSetErrors('title', 'Title cannot be empty');
      isValid = false
    }
    if (editNote.item.content.length === 0) {
      handleSetErrors('content', 'Content cannot be empty');
      isValid = false
    }

    return isValid;
  }

  const getHelperText = (key : 'title' | 'content') => {
    if (errors[key].length !== 0) {
      return errors[key];
    }

    if (editNote === null) return `Please enter ${key}`

    return `${editNote.item[key].length}/${MAX_CHARACTERS_ALLOWED} characters`
  };

  return (
    <>
      <Board
        titles={titles}
        grid={grid}
        setGrid={setGrid}
        setEdit={handleSetEdit}
      />
      <Dialog
        title='Editing note'
        isOpen={editNote !== null}
        onClose={handleEditClose}
        onSave={handleEditSave}
      >
        <>
          <Box sx={{
            width: '100%',
            mb: 2
          }}>
            <TextField
              required
              label='Title'
              value={editNote?.item?.title || ''}
              onChange={(e) => handleEditForm('title', e.target.value)}
              error={errors.title.length !== 0}
              helperText={getHelperText('title')}
              fullWidth
            />
          </Box>
          <Box mb={2}>
            <TextField
              required
              label="Content"
              value={editNote?.item?.content || ''}
              onChange={(e) => handleEditForm('content', e.target.value)}
              error={errors.content.length !== 0}
              helperText={getHelperText('content')}
              multiline
              maxRows={10}
              fullWidth
            />
          </Box>
        </>
      </Dialog>
    </>
  );
}

export default App;

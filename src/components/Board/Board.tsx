import { useState, useCallback } from 'react';
import cloneDeep from 'lodash/fp/cloneDeep';
import isEmpty from 'lodash/fp/isEmpty';
import debounce from 'lodash/fp/debounce';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';

import './board.css'

export type GridDataType = {
  id: number,
  title: string,
  content: string
}

type TitleDataType = {
  id: number,
  title: string,
}

export type GridType = GridDataType[][];
export type TitleType = TitleDataType[];

interface BoardProps {
  titles: TitleType,
  grid: GridType,
  setGrid: (newGrid: GridType) => void
  setEdit: (newGrid: { item: GridDataType, row: number, col: number }) => void
}

function Board({ 
  titles,
  grid,
  setGrid,
  setEdit,
}: BoardProps) {
  const [currentItem, setCurrentItem] = useState<{ item: GridDataType; row: number; col: number } | null>(null)
  const countPerCategory = grid.map((item) => item.length);

  const handleDragStart = (item: GridDataType, row: number, col: number) => {
    setCurrentItem({ item, row, col });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentItem(null);
  };

  const handleDragOver = useCallback(
    debounce(
      10,
      (e: React.DragEvent, targetRow: number, targetCol: number) => {
      e.preventDefault();
      e.stopPropagation();
      if (!currentItem) return;
  
      const { item, row, col } = currentItem;
  
      // do nothing at when over current position
      if (row === targetRow && col === targetCol) return;
  
      const newGrid = cloneDeep(grid);
      newGrid[row].splice(col, 1); // remove the element from original place
      newGrid[targetRow].splice(targetCol, 0, item);
  
      // update the row and column of current dragging item
      setCurrentItem({ item, row: targetRow, col: targetCol });
  
      // update grid
      setGrid(newGrid);
    })
    , [grid, currentItem]);

  return (
    <>
      <div className='board-titles'>
        {
          titles.map((item, index) => (
            <div 
              key={item.id}
              className='title col-block'
            >
              <h2>
                {item.title} {countPerCategory?.[index] && `(${countPerCategory?.[index]})`}
              </h2>
            </div>
          ))
        }
      </div>
      <div className='draggable-container'>
        {grid.map((row, rowIndex) => (
          <div
            className='items col-block' 
            key={rowIndex}
          >
            {row.map((item, colIndex) => (
              <div
                draggable
                key={item.id}
                className={`${item.id === currentItem?.item?.id ? 'item active' : 'item'}`}
                onDragStart={() => handleDragStart(item, rowIndex, colIndex)}
                onDrop={(e) => handleDrop(e)}
                onDragEnd={(e) => handleDrop(e)}
                onDragOver={(e) => handleDragOver(e, rowIndex, colIndex)}
              >
                <h4>{item.title}</h4>
                <p>{item.content}</p>
                <div
                  draggable='false'
                  className='actions'
                >
                  <IconButton 
                    onClick={() => setEdit({ item, row: rowIndex, col: colIndex })}
                  >
                    < MoreVertIcon/>
                  </IconButton>
                </div>
              </div>
            ))}
            {/* This help with dragging into empty column and better UX adding to bottom */}
            {
              (!isEmpty(currentItem) && currentItem.row !== rowIndex) ? (
                <div
                  key={`placeholder-row-${rowIndex}`}
                  className="item placeholder"
                  onDragOver={(e) => handleDragOver(e, rowIndex, row.length)}
                />
              ) : null
            }
          </div>
        ))}
      </div>
    </>
  );
}

export default Board;
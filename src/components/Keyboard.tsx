import { useState } from 'react';
import { Box, Paper } from '@mantine/core';
import { IconBackspace, IconCornerDownLeft, IconArrowUp, IconSwitchHorizontal, IconArrowBigUpLine } from '@tabler/icons-react';

const keyboardLayout = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  [' ']
];

const shiftKeyboardLayout = [
  ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'Backspace'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|'],
  ['CapsLock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'Enter'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?'],
  [' ']
];

interface KeyboardProps {
  neededKey?: string;
  pressedKey?: string;
  onKeyPress: (key: string) => void;
}

export default function Keyboard({ neededKey, pressedKey, onKeyPress }: KeyboardProps) {
  const [shift, setShift] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  const handleKeyPress = (key: string) => {
    if (key === 'Shift') {
      setShift(!shift);
    } else if (key === 'CapsLock') {
      setCapsLock(!capsLock);
    } else {
      let effectiveKey = key;
      if (shift) {
        const rowIndex = shiftKeyboardLayout.findIndex(row => row.includes(key));
        if (rowIndex !== -1) {
          const keyIndex = shiftKeyboardLayout[rowIndex].indexOf(key);
          effectiveKey = shiftKeyboardLayout[rowIndex][keyIndex];
        }
        setShift(false);
      } else if (capsLock) {
        if (key.length === 1 && key >= 'a' && key <= 'z') {
          effectiveKey = key.toUpperCase();
        }
      }
      onKeyPress(effectiveKey);
    }
  };

  const currentLayout = shift ? shiftKeyboardLayout : keyboardLayout;
  const displayLayout = currentLayout.map(row => {
    return row.map(key => {
      if (capsLock && !shift && key.length === 1 && key >= 'a' && key <= 'z') {
        return key.toUpperCase();
      }
      if (capsLock && shift && key.length === 1 && key >= 'A' && key <= 'Z') {
        return key.toLowerCase();
      }
      return key;
    });
  });

  return (
    <Box p="md">
      {displayLayout.map((row, rowIndex) => (
        <Box key={rowIndex} style={{ display: 'flex', justifyContent: 'center', marginBottom: '5px' }}>
          {row.map((key) => {
            const isNeeded = neededKey?.toLowerCase() === key.toLowerCase();
            const isPressed = pressedKey?.toLowerCase() === key.toLowerCase();
            let styles = {};
            if (isNeeded) {
              styles = { backgroundColor: 'lightblue', color: 'black' };
            }
            if (isPressed) {
              styles = { backgroundColor: 'blue', color: 'white' };
            }

            let keyContent: React.ReactNode = key;
            if (key === 'Backspace') keyContent = <IconBackspace />;
            if (key === 'Enter') keyContent = <IconCornerDownLeft />;
            if (key === 'Shift') keyContent = <IconArrowUp />;
            if (key === ' ') keyContent = <span>_</span>;
            if (key === 'Tab') keyContent = <IconSwitchHorizontal />;
            if (key === 'CapsLock') keyContent = <IconArrowBigUpLine />;

            return (
              <Paper
                key={key}
                shadow="sm"
                p="xs"
                withBorder
                onClick={() => handleKeyPress(key)}
                style={{
                  flex: key === ' ' ? 0.3 : 'initial',
                  width: key.length > 1 ? 'auto' : 'min(8vw, 40px)',
                  minWidth: 'min(8vw, 40px)',
                  height: 'min(8vw, 40px)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: '2px',
                  padding: key.length > 1 ? '0 10px' : '0',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  ...styles
                }}
              >
                {keyContent}
              </Paper>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}
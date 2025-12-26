/**
 * Calculate grid layout based on team member count
 * Returns: { columns, rows, fontSize }
 */
export const calculateGridLayout = (memberCount) => {
  const baseFontSize = 16; // px
  const minFontSize = 10; // px - hard minimum

  let columns, rows;

  switch (memberCount) {
    case 0:
      columns = 1;
      rows = 1;
      break;
    case 1:
      columns = 1;
      rows = 1;
      break;
    case 2:
      columns = 2;
      rows = 1;
      break;
    case 3:
      columns = 3;
      rows = 1;
      break;
    case 4:
      columns = 2;
      rows = 2;
      break;
    case 5:
    case 6:
      columns = 3;
      rows = 2;
      break;
    case 7:
    case 8:
    case 9:
      columns = 3;
      rows = 3;
      break;
    case 10:
    case 11:
    case 12:
      columns = 4;
      rows = 3;
      break;
    default:
      // For larger teams, calculate dynamically
      columns = Math.ceil(Math.sqrt(memberCount * 1.5));
      rows = Math.ceil(memberCount / columns);
  }

  // Calculate font size - reduce as members increase
  const fontSize = Math.max(
    minFontSize,
    baseFontSize - (memberCount - 1) * 1.2
  );

  return {
    columns,
    rows,
    fontSize: `${fontSize}px`,
  };
};

/**
 * Generate CSS grid template based on layout
 */
export const getGridStyle = (columns, rows) => {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    gap: '1rem',
    height: '100%',
    width: '100%',
  };
};

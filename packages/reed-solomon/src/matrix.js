import { galExp, galDivide, galMultiply } from './galois';

function newMatrix(rows, cols) {
  if (rows <= 0) {
    return null;
  }
  if (cols <= 0) {
    return null;
  }

  const m = [];
  for (let i = 0; i < rows; i++) {
    m[i] = [];
    for (let j = 0; j < cols; j++) {
      m[i][j] = 0;
    }
  }
  return m;
}

function vandermonde(rows, cols) {
  const result = newMatrix(rows, cols);

  for (let r = 0; r < result.length; r++) {
    for (let c = 0; c < result[r].length; c++) {
      // console.log('r', r)
      // console.log('c', c)
      result[r][c] = galExp(r, c);
    }
  }

  return result;
}

function SubMatrix(m, rmin, cmin, rmax, cmax) {
  const result = newMatrix(rmax - rmin, cmax - cmin);

  for (let r = rmin; r < rmax; r++) {
    for (let c = cmin; c < cmax; c++) {
      result[r - rmin][c - cmin] = m[r][c];
    }
  }

  return result;
}

function identityMatrix(size) {
  const result = newMatrix(size, size);

  for (let i = 0; i < result.length; i++) {
    result[i][i] = 1;
  }

  return result;
}

// Multiply multiplies this matrix (the one on the left) by another
// matrix (the one on the right) and returns a new matrix with the result.
function Multiply(m, right) {
  if (m[0].length !== right.length) {
    return null;
    throw new Error(
      `columns on left (${m[0].length}) is different than rows on right (${right.length})`,
    );
  }
  let result = [];
  for (let r = 0; r < m.length; r++) {
    result[r] = [];
    for (let c = 0; c < right[0].length; c++) {
      let value = 0;
      for (let i = 0; i < m[0].length; i++) {
        value ^= galMultiply(m[r][i], right[i][c]);
      }
      result[r][c] = value;
    }
  }
  return result;
}

function Augment(m, right) {
  if (m.length !== right.length) throw new Error('matrix sizes do not match');

  const result = newMatrix(m.length, m[0].length + right[0].length);

  for (let r = 0; r < m.length; r++) {
    for (let c = 0; c < m[r].length; c++) {
      result[r][c] = m[r][c];
    }

    let cols = m[0].length;
    for (let c = 0; c < right[0].length; c++) {
      result[r][cols + c] = right[r][c];
    }
  }

  return result;
}

function Invert(m) {
  const size = m.length;
  let work = identityMatrix(size);
  work = Augment(m, work);
  work = gaussianElimination(work);

  return SubMatrix(work, 0, size, size, size * 2);
}

function SwapRows(m, r1, r2) {
  if (r1 < 0 || m.length <= r1 || r2 < 0 || m.length <= r2) {
    return new Error('Invalid row size');
  }
  [m[r2], m[r1]] = [m[r1], m[r2]];
  return m;
}

function gaussianElimination(m) {
  const rows = m.length;
  const columns = m[0].length;

  // Clear out the part below the main diagonal and scale the main
  // diagonal to be 1.
  for (let r = 0; r < rows; r++) {
    // If the element on the diagonal is 0, find a row below
    // that has a non-zero and swap them.
    if (m[r][r] === 0) {
      for (let rowBelow = r + 1; rowBelow < rows; rowBelow++) {
        if (m[rowBelow][r] !== 0) {
          let err = SwapRows(m, r, rowBelow);
          if (err !== null) {
            return err;
          }
          break;
        }
      }
    }
    // If we couldn't find one, the matrix is singular.
    // if (m[r][r] === 0) {
    //     return errSingular;
    // }
    // Scale to 1.
    if (m[r][r] !== 1) {
      const scale = galDivide(1, m[r][r]);
      for (let c = 0; c < columns; c++) {
        m[r][c] = galMultiply(m[r][c], scale);
      }
    }
    // Make everything below the 1 be a 0 by subtracting
    // a multiple of it.  (Subtraction and addition are
    // both exclusive or in the Galois field.)
    for (let rowBelow = r + 1; rowBelow < rows; rowBelow++) {
      if (m[rowBelow][r] !== 0) {
        const scale = m[rowBelow][r];
        for (let c = 0; c < columns; c++) {
          m[rowBelow][c] ^= galMultiply(scale, m[r][c]);
        }
      }
    }
  }

  // Now clear the part above the main diagonal.
  for (let d = 0; d < rows; d++) {
    for (let rowAbove = 0; rowAbove < d; rowAbove++) {
      if (m[rowAbove][d] !== 0) {
        const scale = m[rowAbove][d];
        for (let c = 0; c < columns; c++) {
          m[rowAbove][c] ^= galMultiply(scale, m[d][c]);
        }
      }
    }
  }

  return m;
}

function buildMatrix(totalShards, dataShards) {
  const vm = vandermonde(totalShards, dataShards);
  const top = SubMatrix(vm, 0, 0, dataShards, dataShards);
  const topInv = Invert(top);
  return Multiply(vm, topInv);
}

export { buildMatrix };

export const rule_underpopulation = async ( _copiedCellArray, _rowIndex, _colIndex, _noROws, _noCols ) => {
    const neighbours = await countNeighBours( _copiedCellArray, _rowIndex, _colIndex, _noROws, _noCols );
    return neighbours < 2 ? 1 : 0;
}

export const rule_survival = async ( _copiedCellArray, _rowIndex, _colIndex, _noROws, _noCols ) => {
    const neighbours = await countNeighBours( _copiedCellArray, _rowIndex, _colIndex, _noROws, _noCols );
    return neighbours === 2 || neighbours === 3 ? 1 : 0;
}

export const rule_crowding = async ( _copiedCellArray, _rowIndex, _colIndex, _noROws, _noCols ) => {
    const neighbours = await countNeighBours( _copiedCellArray, _rowIndex, _colIndex, _noROws, _noCols );
    return neighbours > 3 ? 1 : 0;
}

export const rule_reproduction = async ( _copiedCellArray, _rowIndex, _colIndex, _noROws, _noCols ) => {
    const neighbours = await countNeighBours( _copiedCellArray, _rowIndex, _colIndex, _noROws, _noCols );
    return neighbours === 3 ? 1 : 0;
}

export const runActiveCellRules = async ( _copiedCellArray, _rowIndex, _colIndex, _noROws, _noCols ) => {
    const underpopulation = await rule_underpopulation( _copiedCellArray, _rowIndex, _colIndex, _noROws, _noCols );
    if ( underpopulation ) { return 0; }
    const survival = await rule_survival( _copiedCellArray, _rowIndex, _colIndex, _noROws, _noCols );
    if ( !survival ) { return 0; }
    const crowding = await rule_crowding( _copiedCellArray, _rowIndex, _colIndex, _noROws, _noCols );
    if ( crowding ) { return 0; }
    return 1;
}

export const runDeadCellRules = async ( _copiedCellArray, _rowIndex, _colIndex, _noROws, _noCols ) => {
    const reproduction = await rule_reproduction( _copiedCellArray, _rowIndex, _colIndex, _noROws, _noCols );
    return reproduction;
}

export const countNeighBours = async ( _cellArray, _rowIndex, _colIndex, _noROws, _noCols ) => {
    const copiedCellArray = _cellArray;
    let cellIdHome = _rowIndex + '-' + _colIndex;
    let neighbours = 0;
    for ( let row = parseInt( _rowIndex - 1 ); row < parseInt( _rowIndex + 2 ); row++ ) {
        for ( let col = parseInt( _colIndex - 1 ); col < parseInt( _colIndex + 2 ); col++ ) {
            let cellIdCheck = row + '-' + col;
            if ( cellIdCheck !== cellIdHome ) {
                if ( row > -1 && row < _noROws && col > -1 && col < _noCols ) {
                    if ( copiedCellArray[ row ][ col ].cellState ) { neighbours++; }
                }
            }
        }
    }
    return neighbours;
}

export const runLiveSweep = async ( _cellArray, _noOfRows, _noOfCols ) => {
    let rows = parseInt( _noOfRows );
    let cols = parseInt( _noOfCols );
    const copiedCellArray = _cellArray;
    for ( let rowIndex = 0; rowIndex < rows; rowIndex++ ) {
        for ( let colIndex = 0; colIndex < cols; colIndex++ ) {
            if ( copiedCellArray[ rowIndex ][ colIndex ].cellState ) {
                const result = await runActiveCellRules( copiedCellArray, rowIndex, colIndex, rows, cols );
                if ( result ) {
                    copiedCellArray[ rowIndex ][ colIndex ].cellState = true;
                } else {
                    copiedCellArray[ rowIndex ][ colIndex ].cellState = false;
                }
            }
        }
    }
    return copiedCellArray;
}

export const runDeadSweep = async ( _cellArray, _noOfRows, _noOfCols ) => {
    let rows = parseInt( _noOfRows );
    let cols = parseInt( _noOfCols );
    const copiedCellArray = _cellArray;
    for ( let rowIndex = 0; rowIndex < rows; rowIndex++ ) {
        for ( let colIndex = 0; colIndex < cols; colIndex++ ) {
            if ( !copiedCellArray[ rowIndex ][ colIndex ].cellState ) {
                const result = await runDeadCellRules( copiedCellArray, rowIndex, colIndex, rows, cols );
                if ( result ) {
                    copiedCellArray[ rowIndex ][ colIndex ].cellState = true;
                } else {
                    copiedCellArray[ rowIndex ][ colIndex ].cellState = false;
                }
            }
        }
    }
    return copiedCellArray;
}
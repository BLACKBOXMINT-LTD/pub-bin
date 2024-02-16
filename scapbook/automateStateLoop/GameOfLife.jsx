import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from "uuid";
import "../../goltable.css";
import { runDeadSweep, runLiveSweep } from './gameOfLifeFns';

function GameOfLife ({Rows, Columns}) {

    const [ gameOn, setGameOn ] = useState(false);
    const [ noOfRows, setNoOfRows ] = useState( );
    const [ noOfCols, setNoOfCols ] = useState( );
    const [ tableBuilt, setTableBuilt]=useState();
    const [ lastMap, setLastMap ] = useState( [ [] ] );
    const [ thisMap, setThisMap ] = useState( [ [] ] );
    const [ btnDisabled, setBtnDisabled ] = useState(false);

    const changeCellsState = async ( _row, _column ) => {
        setGameOn( false );
        setBtnDisabled(false);
        const copyCellArray = thisMap.map( row => [ ...row ] );
        const currentCell = copyCellArray[ _row ][ _column ];
        currentCell.cellState = !currentCell.cellState;
        const currentcellstring = JSON.stringify( copyCellArray );
        setThisMap( JSON.parse( currentcellstring ) );
    };

    useEffect( () => {
        setNoOfRows( parseInt( Rows ) );
        setNoOfCols( parseInt( Columns ) );
    }, [ Rows, Columns ] )

    useEffect( () => {
        const buildTable = async () => {
            let cells = []; cells.length = [];
            for ( let rowIndex = 0; rowIndex < noOfRows; rowIndex++ ) {
                cells[ rowIndex ] = [];
                for ( let colIndex = 0; colIndex < noOfCols; colIndex++ ) {
                    cells[ rowIndex ][ colIndex ] = { cellIndex: rowIndex + '-' + colIndex, cellState: false };
                }
            }
            setThisMap( cells );
            setTableBuilt(true);
        }
        if ( noOfRows || noOfCols ) { if (!tableBuilt) {buildTable();} }
    }, [ noOfRows, noOfCols, tableBuilt] )

    useEffect(() => {
        const automateGrid = async() =>{
            const copyLastMap = lastMap;
            const liveSweep = await runLiveSweep( JSON.parse( copyLastMap ), noOfRows, noOfCols );
            const copyCellArray = liveSweep.map( row => [ ...row ] );
            const deadSweep = await runDeadSweep( await copyCellArray, noOfRows, noOfCols );
            const copyCellSweep = deadSweep.map( row => [ ...row ] );
            setThisMap( copyCellSweep );
        }
        if ( tableBuilt && noOfRows && noOfCols ){
            automateGrid();
        }
    }, [lastMap])
    
    const startGame = async () => {
        setGameOn(true);
        const holdCellArray = thisMap.map( row => [ ...row ] );
        const holdCellArraystring = JSON.stringify( holdCellArray );
        setLastMap( holdCellArraystring );
    }

    const clearBoard =async() =>{
        setGameOn( false );
        let cells = []; cells.length = [];
        for ( let rowIndex = 0; rowIndex < noOfRows; rowIndex++ ) {
            cells[ rowIndex ] = [];
            for ( let colIndex = 0; colIndex < noOfCols; colIndex++ ) {
                cells[ rowIndex ][ colIndex ] = { cellIndex: rowIndex + '-' + colIndex, cellState: false };
            }
        }
        setThisMap( cells );
    }

    useEffect(() => {
        if (gameOn){
            const holdCellArray = thisMap.map( row => [ ...row ] );
            const holdCellArraystring = JSON.stringify( holdCellArray );
            setLastMap( holdCellArraystring );
        }
    }, [thisMap])
    
    return (
        <div className="flex flex-col content-center items-center justify-center">
            <div className="gogrid" style={ { '--numRows': noOfRows, '--numCols': noOfCols }}>
                { thisMap ?
                    thisMap.map( ( columns, row ) => (
                        columns.map( ( value, column ) => (
                            value.cellState ?
                                <div key={ uuidv4() } id={ value.cellIndex } className="gogrid-item gogrid-item-alive border-2 border-zinc-600 text-center" onClick={ () => { changeCellsState( row, column ) } }>
                                    { value.cellIndex }
                                </div> :
                                <div key={ uuidv4() } id={ value.cellIndex } className="gogrid-item gogrid-item-dead border-2 border-zinc-600 text-center" onClick={ () => { changeCellsState( row, column ) } }>
                                    { value.cellIndex }
                                </div>
                        ) )
                    ) ): null }
            </div>
            <div className='columns-2'>
                <div className=''><button className="bbmBtn mt-6" onClick={ async () => { startGame() } } disabled={ btnDisabled }>RUN PATTERN</button></div>
                <div className=''><button className="bbmBtn mt-6" onClick={ async () => { clearBoard() } } disabled={ btnDisabled }>CLEAR BOARD</button></div>
            </div>
        </div>
    );
}

export default GameOfLife
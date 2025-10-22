import { useState, useRef } from 'react';
import './App.css'
import Square from './Square.jsx';
import Piece from './Piece.jsx';
import { isValidMove, isKingInCheck } from './gameLogic.jsx';

const Board = () => {
    const [pieces, setPieces] = useState({
        '0,0': { type: 'dr' , color: "dark", hasMoved: false },
        '0,1': { type: 'dkn' , color: "dark", hasMoved: false },
        '0,2': { type: 'db' , color: "dark", hasMoved: false },
        '0,3': { type: 'dq' , color: "dark", hasMoved: false },
        '0,4': { type: 'dk' , color: "dark", hasMoved: false },
        '0,5': { type: 'db' , color: "dark", hasMoved: false },
        '0,6': { type: 'dkn' , color: "dark", hasMoved: false },
        '0,7': { type: 'dr' , color: "dark", hasMoved: false },
        '1,0': { type: 'dp' , color: "dark", hasMoved: false },
        '1,1': { type: 'dp' , color: "dark", hasMoved: false },
        '1,2': { type: 'dp' , color: "dark", hasMoved: false },
        '1,3': { type: 'dp' , color: "dark", hasMoved: false },
        '1,4': { type: 'dp' , color: "dark", hasMoved: false },
        '1,5': { type: 'dp' , color: "dark", hasMoved: false },
        '1,6': { type: 'dp' , color: "dark", hasMoved: false },
        '1,7': { type: 'dp' , color: "dark", hasMoved: false },
        '6,0': { type: 'lp' , color: "light", hasMoved: false },
        '6,1': { type: 'lp' , color: "light", hasMoved: false },
        '6,2': { type: 'lp' , color: "light", hasMoved: false },
        '6,3': { type: 'lp' , color: "light", hasMoved: false },
        '6,4': { type: 'lp' , color: "light", hasMoved: false },
        '6,5': { type: 'lp' , color: "light", hasMoved: false },
        '6,6': { type: 'lp' , color: "light", hasMoved: false },
        '6,7': { type: 'lp' , color: "light", hasMoved: false },
        '7,0': { type: 'lr' , color: "light", hasMoved: false },
        '7,1': { type: 'lkn' , color: "light", hasMoved: false },
        '7,2': { type: 'lb' , color: "light", hasMoved: false },
        '7,3': { type: 'lq' , color: "light", hasMoved: false },
        '7,4': { type: 'lk' , color: "light", hasMoved: false },
        '7,5': { type: 'lb' , color: "light", hasMoved: false },
        '7,6': { type: 'lkn' , color: "light", hasMoved: false },
        '7,7': { type: 'lr' , color: "light", hasMoved: false },
    });

    const [draggingPiece, setDraggingPiece] = useState(null);
    const [dragPos, setDragPos] = useState({ x: 0, y: 0});
    const [turn, setTurn] = useState("light");
    const [checkedKing, setCheckedKing] = useState(null);
    const [enPassantTarget, setEnPassantTarget] = useState(null);
    const [promotionInfo, setPromotionInfo] = useState(null);
    const boardRef = useRef(null);
    

    const handleMouseMove = (e) => {
        if(draggingPiece && boardRef.current) {
            const rect = boardRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setDragPos({ x, y });
        }
    }

    const handleSquareClick = (pos, e) => {
        const piece = pieces[pos];

        if(!draggingPiece && piece){
            if (piece.color !== turn) return;
            if(boardRef.current && e) {
                const rect = boardRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                setDragPos({ x, y });
            }
            setDraggingPiece({ pos, piece });
            return;
        }

        if (draggingPiece) {
            const [fromRow, fromCol] = draggingPiece.pos.split(",").map(Number);
            const [toRow, toCol] = pos.split(",").map(Number);

            if (pos === draggingPiece.pos){
                setDraggingPiece(null);
                return;
            }

            if(!isValidMove(draggingPiece.pos, pos, draggingPiece.piece, pieces, enPassantTarget)) {
                setDraggingPiece(null);
                return;
            }

            const updated = { ...pieces };

            let didPromote = false;
            if(draggingPiece.piece.type === "dp" || draggingPiece.piece.type === "lp"){
                
                if(!enPassantTarget && !(pos === enPassantTarget)){
                    if (Math.abs(toRow - fromRow) === 2) {
                        const middleRow = (fromRow + toRow) / 2;
                        setEnPassantTarget(`${middleRow},${toCol}`);
                    } else {
                        setEnPassantTarget(null);
                    }
                    
                    const isLight = draggingPiece.piece.color === "light";
                    console.log(isLight && toRow === 0);
                    if ((isLight && toRow === 0) || (!isLight && toRow === 7)) {
                        const promotedType = isLight ? "lq" : "dq";
                        updated[pos] = { 
                            ...draggingPiece.piece,
                            type: promotedType,
                            hasMoved: true,
                        };
                        didPromote = true;
                    }
                }
                else if (enPassantTarget && (pos === enPassantTarget)){
                    const [toRow, toCol] = pos.split(",").map(Number);
                    const dir = draggingPiece.piece.color === "light" ? 1 : -1;
                    const capturedPawnPos = `${toRow + dir},${toCol}`
                    delete updated[capturedPawnPos];
                }
                else {
                    setEnPassantTarget(null);
                }
            }
            if((draggingPiece.piece.type === "dk" || draggingPiece.piece.type === "lk")
                    && Math.abs(toCol - fromCol) === 2) {
                        const isKingSide = toCol > fromCol;
                        const rookFrom = `${fromRow},${isKingSide ? 7 : 0}`;
                        const rookTo = `${fromRow},${isKingSide ? toCol - 1 : toCol + 1}`;

                        updated[rookTo] = { ...pieces[rookFrom], hasMoved: true };
                        delete updated[rookFrom];
            }
            if(!didPromote){
                updated[pos] = { ...draggingPiece.piece, hasMoved: true };
            }

            delete updated[draggingPiece.pos];

            if(isKingInCheck(updated, draggingPiece.piece.color, isValidMove)) {
                console.log("Nope. That'd be check");
                setDraggingPiece(null);
                return;
            }
            
            setPieces(updated);
            setDraggingPiece(null);
            
            const opponent = draggingPiece.piece.color === "light" ? "dark" : "light";
            if(isKingInCheck(updated, opponent)) {
                setCheckedKing(opponent);
            } else {
                setCheckedKing(null);
            }
            setTurn((prev) => (prev === "light" ? "dark" : "light")); // swap turns
        }
        
    };

    const renderSquares = () => {
        const squares = [];

        let checkedKingPos = null;
        if (checkedKing) {
            for (const pos in pieces) {
                const p = pieces[pos];
                if((p.type === "dk" || p.type === "lk") && p.color === checkedKing) {
                    checkedKingPos = pos;
                    break;
                }
            }
        }

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const isLight = (row + col) % 2 === 0;
                const color = isLight ? '#eee' : '#666';
                const position = `${row},${col}`;
                const piece = draggingPiece && draggingPiece.pos === position 
                            ? null 
                            : (pieces && pieces[position]);

                squares.push(
                <Square
                    key={position}
                    color={color}
                    piece={piece}
                    position={position}
                    onClick={handleSquareClick}
                    inCheck={checkedKingPos === position}
                />
                );
            }
        }
        return squares;
    };

    return (
        <div
            ref={boardRef}
            style={{
                position: "relative",
                width: 8 * 64,
                height: 8 * 64,
                display: "grid",
                gridTemplateColumns: "repeat(8, 64px)",
                gridTemplateRows: "repeat(8, 64px)",
            }}
            onMouseMove={handleMouseMove}
        >
            {renderSquares()}
            
            {draggingPiece && (
                <div
                    style={{
                        position: "absolute",
                        left: dragPos.x - 32,
                        top: dragPos.y - 32,
                        pointerEvents: "none",
                    }}
                >
                    <Piece type={draggingPiece.piece.type} />
                </div>
            )}
        </div>
    )
};

export default Board;
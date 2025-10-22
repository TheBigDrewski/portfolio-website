import { useState, useRef, useEffect } from 'react';
import './App.css'
import Square from './Square.jsx';
import Piece, { symbolMap } from './Piece.jsx';
import { isValidMove, isKingInCheck, isCheckMate, isStalemate } from './gameLogic.jsx';

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
    const [isGameOver, setIsGameOver] = useState(null);
    const [winner, setWinner] = useState(null);
    const boardRef = useRef(null);
    const [squareSize, setSquareSize] = useState(0);

    useEffect(() => {
        const updateSize = () => {
            if (boardRef.current) {
                setSquareSize(boardRef.current.offsetWidth / 8);
            }
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

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
                        setPromotionInfo({
                            position: pos,
                            color: draggingPiece.piece.color,
                            from: draggingPiece.pos,
                        });
                        setDraggingPiece(null);
                        didPromote = true;
                        return;
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
                console.log("King is in Check");
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

            if (isKingInCheck(updated, opponent)) {
                setCheckedKing(opponent);

                if (isCheckMate(updated, opponent)) {
                    setWinner(opponent.color === "light" ? "Black" : "White");
                    setIsGameOver(true);
                    return;
                }
                else if (isStalemate(updated, opponent)) {
                    setWinner(null);
                    setIsGameOver(true);
                }
            } else {
                setCheckedKing(null);
            }
        }
    };

    const handlePromotionSelect = (type) => {
        if(!promotionInfo) return;

        const {position, color, from } = promotionInfo;
        const updated = { ...pieces };
        
        delete updated[from];
        updated[position] = {
            type: `${color[0]}${type}`,
            color,
            hasMoved: true,
        }

        setPieces(updated);
        setPromotionInfo(null);
        setTurn((prev) => (prev === "light" ? "dark" : "light"));
    }

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
        <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-4rem)] p-4 md:p-8 bg-gray-900 text-white relative">
            {/* Top Info Row (turn indicator, check status, etc.) */}
            <div className="flex justify-between items-center w-full max-w-6xl mb-6 px-4">
            <div className="text-lg font-semibold">
                Turn: <span className="text-primary capitalize">{turn === "light" ? "White" : "Black"}</span>
            </div>
            <div className="text-sm text-gray-400">
                {checkedKing ? `${checkedKing} king in check` : ""}
            </div>
            </div>

            {/* Main Content Row */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-6xl">
            {/* Game Board Wrapper */}
                <div className="relative flex items-center justify-center w-full max-w-[90vmin] aspect-square">
                {/* Coordinate Labels */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
                    {/* File letters along bottom */}
                    <div className="absolute bottom-[0%] left-0 w-full flex justify-between px-[2.25%] text-gray-400 text-xs sm:text-sm select-none">
                    {["a","b","c","d","e","f","g","h"].map((f) => (
                        <span key={f} className="font-mono">{f}</span>
                    ))}
                    </div>
                    {/* Rank numbers along left */}
                    <div className="absolute top-0 left-[0.5%] h-full flex flex-col justify-between py-[2.25%] text-gray-400 text-xs sm:text-sm select-none">
                    {[8,7,6,5,4,3,2,1].map((r) => (
                        <span key={r} className="font-mono">{r}</span>
                    ))}
                    </div>
                </div>

                {/* Actual Board Grid */}
                <div
                    ref={boardRef}
                    className="
                    relative grid grid-cols-8 grid-rows-8
                    w-full h-full
                    bg-gray-800 rounded-lg shadow-2xl overflow-hidden select-none
                    transition-all duration-300
                    "
                    onMouseMove={handleMouseMove}
                >
                    {renderSquares()}

                    {draggingPiece && (
                    <div
                        style={{
                        position: "absolute",
                        left: dragPos.x - squareSize / 2,
                        top: dragPos.y - squareSize / 2,
                        width: `${squareSize}px`,
                        height: `${squareSize}px`,
                        pointerEvents: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        }}
                    >
                        <Piece type={draggingPiece.piece.type} fixedSize />
                    </div>
                    )}

                    {promotionInfo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-white flex flex-col items-center space-y-4 animate-fadeIn">
                        <h2 className="text-xl font-semibold mb-2">Choose your promotion</h2>
                        <div className="flex space-x-4">
                            {["q", "r", "b", "kn"].map((type) => {
                            const colorPrefix = promotionInfo.color === "light" ? "l" : "d";
                            const pieceKey =
                                type === "kn"
                                ? `${colorPrefix}Knight`
                                : type === "b"
                                ? `${colorPrefix}Bishop`
                                : type === "r"
                                ? `${colorPrefix}Rook`
                                : `${colorPrefix}Queen`;

                            return (
                                <button
                                key={type}
                                onClick={() => handlePromotionSelect(type)}
                                className="w-16 h-16 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-all duration-200"
                                >
                                <img
                                    src={symbolMap[pieceKey]}
                                    alt={pieceKey}
                                    className="w-12 h-12 select-none"
                                />
                                </button>
                            );
                            })}
                        </div>
                        </div>
                    </div>
                    )}

                    {isGameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white z-50 transition-all duration-500 ease-out backdrop-blur-sm animate-fadeIn">
                        <h1 className="text-4xl font-bold mb-4">
                        {winner ? "Checkmate!" : "Stalemate!"}
                        </h1>
                        <p className="text-lg mb-8">
                        {winner ? `${winner} wins the game` : "It's a draw"}
                        </p>
                        <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-primary hover:bg-primary/80 text-white font-semibold rounded-lg transition-all duration-200"
                        >
                        Play Again
                        </button>
                    </div>
                    )}
                </div>
                </div>

            {/* Sidebar (future move history + import/export) */}
            <div className="hidden md:flex flex-col items-start text-gray-300 w-64">
                <h3 className="text-lg font-semibold mb-2">Move History</h3>
                <div className="bg-gray-800 rounded-lg p-3 w-full h-[400px] overflow-y-auto">
                <p className="text-sm italic text-gray-500">Coming soon...</p>
                </div>
            </div>
            </div>
        </div>
    );
};

export default Board;
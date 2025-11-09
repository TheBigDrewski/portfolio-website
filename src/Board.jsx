import { useState, useRef, useEffect } from 'react';
import './App.css'
import Square from './Square.jsx';
import Piece, { symbolMap } from './Piece.jsx';
import { isValidMove, isKingInCheck, isCheckMate, isStalemate } from './gameLogic.jsx';
import { hasWarned } from 'framer-motion';

const Board = () => {
    const whitePlayerBoard = {
        '0,0': { type: 'dr' , color: "Black", hasMoved: false },
        '0,1': { type: 'dkn' , color: "Black", hasMoved: false },
        '0,2': { type: 'db' , color: "Black", hasMoved: false },
        '0,3': { type: 'dq' , color: "Black", hasMoved: false },
        '0,4': { type: 'dk' , color: "Black", hasMoved: false },
        '0,5': { type: 'db' , color: "Black", hasMoved: false },
        '0,6': { type: 'dkn' , color: "Black", hasMoved: false },
        '0,7': { type: 'dr' , color: "Black", hasMoved: false },
        '1,0': { type: 'dp' , color: "Black", hasMoved: false },
        '1,1': { type: 'dp' , color: "Black", hasMoved: false },
        '1,2': { type: 'dp' , color: "Black", hasMoved: false },
        '1,3': { type: 'dp' , color: "Black", hasMoved: false },
        '1,4': { type: 'dp' , color: "Black", hasMoved: false },
        '1,5': { type: 'dp' , color: "Black", hasMoved: false },
        '1,6': { type: 'dp' , color: "Black", hasMoved: false },
        '1,7': { type: 'dp' , color: "Black", hasMoved: false },
        '6,0': { type: 'lp' , color: "White", hasMoved: false },
        '6,1': { type: 'lp' , color: "White", hasMoved: false },
        '6,2': { type: 'lp' , color: "White", hasMoved: false },
        '6,3': { type: 'lp' , color: "White", hasMoved: false },
        '6,4': { type: 'lp' , color: "White", hasMoved: false },
        '6,5': { type: 'lp' , color: "White", hasMoved: false },
        '6,6': { type: 'lp' , color: "White", hasMoved: false },
        '6,7': { type: 'lp' , color: "White", hasMoved: false },
        '7,0': { type: 'lr' , color: "White", hasMoved: false },
        '7,1': { type: 'lkn' , color: "White", hasMoved: false },
        '7,2': { type: 'lb' , color: "White", hasMoved: false },
        '7,3': { type: 'lq' , color: "White", hasMoved: false },
        '7,4': { type: 'lk' , color: "White", hasMoved: false },
        '7,5': { type: 'lb' , color: "White", hasMoved: false },
        '7,6': { type: 'lkn' , color: "White", hasMoved: false },
        '7,7': { type: 'lr' , color: "White", hasMoved: false },
    }
    const blackPlayerBoard = {
        '0,0': { type: 'lr' , color: "White", hasMoved: false },
        '0,1': { type: 'lkn' , color: "White", hasMoved: false },
        '0,2': { type: 'lb' , color: "White", hasMoved: false },
        '0,3': { type: 'lk' , color: "White", hasMoved: false },
        '0,4': { type: 'lq' , color: "White", hasMoved: false },
        '0,5': { type: 'lb' , color: "White", hasMoved: false },
        '0,6': { type: 'lkn' , color: "White", hasMoved: false },
        '0,7': { type: 'lr' , color: "White", hasMoved: false },
        '1,0': { type: 'lp' , color: "White", hasMoved: false },
        '1,1': { type: 'lp' , color: "White", hasMoved: false },
        '1,2': { type: 'lp' , color: "White", hasMoved: false },
        '1,3': { type: 'lp' , color: "White", hasMoved: false },
        '1,4': { type: 'lp' , color: "White", hasMoved: false },
        '1,5': { type: 'lp' , color: "White", hasMoved: false },
        '1,6': { type: 'lp' , color: "White", hasMoved: false },
        '1,7': { type: 'lp' , color: "White", hasMoved: false },
        '6,0': { type: 'dp' , color: "Black", hasMoved: false },
        '6,1': { type: 'dp' , color: "Black", hasMoved: false },
        '6,2': { type: 'dp' , color: "Black", hasMoved: false },
        '6,3': { type: 'dp' , color: "Black", hasMoved: false },
        '6,4': { type: 'dp' , color: "Black", hasMoved: false },
        '6,5': { type: 'dp' , color: "Black", hasMoved: false },
        '6,6': { type: 'dp' , color: "Black", hasMoved: false },
        '6,7': { type: 'dp' , color: "Black", hasMoved: false },
        '7,0': { type: 'dr' , color: "Black", hasMoved: false },
        '7,1': { type: 'dkn' , color: "Black", hasMoved: false },
        '7,2': { type: 'db' , color: "Black", hasMoved: false },
        '7,3': { type: 'dk' , color: "Black", hasMoved: false },
        '7,4': { type: 'dq' , color: "Black", hasMoved: false },
        '7,5': { type: 'db' , color: "Black", hasMoved: false },
        '7,6': { type: 'dkn' , color: "Black", hasMoved: false },
        '7,7': { type: 'dr' , color: "Black", hasMoved: false },
    }

    const [pieces, setPieces] = useState(blackPlayerBoard);
    const pieceValues = {
        p: 1,
        kn: 3,
        b: 3,
        r: 5,
        q: 9,
        k: 1000
    };

    const [draggingPiece, setDraggingPiece] = useState(null);
    const [dragPos, setDragPos] = useState({ x: 0, y: 0});
    const [turn, setTurn] = useState("White");
    const [checkedKing, setCheckedKing] = useState(null);
    const [enPassantTarget, setEnPassantTarget] = useState(null);
    const [promotionInfo, setPromotionInfo] = useState(null);
    const [isGameOver, setIsGameOver] = useState(null);
    const [winner, setWinner] = useState(null);
    const [squareSize, setSquareSize] = useState(0);
    const [isVsComputer, setIsVsComputer] = useState(true);
    const [aiColor, setAiColor] = useState("Black"); // you can switch this
    const [moveHistory, setMoveHistory] = useState([]);
    const [isGameStart, setIsGameStart] = useState(true);

    const boardRef = useRef(null);

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
                    
                    const isLight = draggingPiece.piece.color === "White";
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
                    const dir = draggingPiece.piece.color === "White" ? 1 : -1;
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
                setDraggingPiece(null);
                return;
            }
            
            setPieces(updated);
            setMoveHistory(prev => [
                ...prev,
                {
                    color: draggingPiece,
                    piece: draggingPiece.piece.type,
                    from: draggingPiece.pos,
                    to: pos,
                    captured: pieces[pos] ? pieces[pos].type : null,
                }
            ]);

            const opponent = draggingPiece.piece.color === "White" ? "Black" : "White";
            setDraggingPiece(null);

            if(isKingInCheck(updated, opponent)) {
                setCheckedKing(opponent);
            } else {
                setCheckedKing(null);
            }
            setTurn((prev) => (prev === "White" ? "Black" : "White")); // swap turns

            setPieces(updated => {
                const nextBoard = { ...updated };
                if(isVsComputer && turn === "White"){
                    setTimeout(() => makeAiMove(nextBoard), 1000);
                }
                return nextBoard;
            });
            

            if (isKingInCheck(updated, opponent)) {
                setCheckedKing(opponent);

                if (isCheckMate(updated, opponent)) {
                    setWinner(opponent === "White" ? "Black" : "White");
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
        setTurn((prev) => (prev === "White" ? "Black" : "White"));
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

    function makeAiMove (currentBoard) {
        const aiPieces = Object.entries(currentBoard).filter(
            ([, p]) => p.color === aiColor
        );

        let bestMove = null;
        let bestScore = -Infinity;
        let lastPlayableMove = null;

        for (const [from, piece] of aiPieces) {
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const to = `${row},${col}`;
                    if (!isValidMove(from, to, piece, currentBoard)) continue; 
                    lastPlayableMove = { from, to, piece };

                    const newBoard = structuredClone(currentBoard);
                    newBoard[to] = { ...piece, hasMoved: true };
                    delete newBoard[from];

                    if (isKingInCheck(currentBoard, aiColor)) continue;

                    const score = evaluateBoard(newBoard, aiColor);
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = { from, to, piece };
                    }
                }
            }
        }

        if (bestMove) handleAiMove(bestMove, currentBoard);
        //else if(lastPlayableMove && !bestMove) handleAiMove(lastPlayableMove, currentBoard);
    }

    function handleAiMove({ from, to, piece }, baseBoard) {
        const opponent = aiColor === "White" ? "Black" : "White";
        setPieces(prev => {
            const updated = structuredClone(baseBoard)
            updated[to] = { ...piece, hasMoved: true };
            if(isKingInCheck(updated, opponent)){
                setCheckedKing(opponent);

                if (isCheckMate(updated, opponent)) {
                    setWinner(opponent === "White" ? "Black" : "White");
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
            delete updated[from];
            return updated;
        });

        setMoveHistory(prev => [
                ...prev,
                {
                    color: aiColor,
                    piece: piece.type,
                    from,
                    to,
                    captured: pieces[to] ? pieces[to].type : null,
                }
            ]);

        setTurn(piece && piece.color === "White" ? "Black" : "White");
    }

    function evaluateBoard (pieces, color) {
        let score = 0;
        for (const [, piece] of Object.entries(pieces)) {
            if(!piece || !piece.type) continue;

            const val = pieceValues[piece.type.slice(1)] || 0;
            score += piece.color === color ? val : -val;
        }
        return score;
    }

    return (
        <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-4rem)] p-4 md:p-8 bg-gray-900 text-white relative">
            {/* Top Info Row (turn indicator, check status, etc.) */}
            <div className="flex justify-between items-center w-full max-w-6xl mb-6 px-4">
            <div className="text-lg font-semibold">
                Turn: <span className="text-primary capitalize">{turn === "White" ? "White" : "Black"}</span>
            </div>
            <div className="text-sm text-red-400">
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

                    {isGameStart && (
                        <div className="absolute inset-0 bg-black/80 text-white z-50 transition-all duration-500 ease-out backdrop-blur-sm animate-fadeIn">
                            <div className="flex items-center justify-center">
                                <div className="flex flex-col px-3 py-3">
                                    <h3>White</h3>
                                    <button
                                        onClick={() => [setAiColor("Black"), setPieces(whitePlayerBoard)]}
                                        className="w-16 h-16 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200"
                                        >
                                            <img src={symbolMap['lk']}></img>
                                    </button>
                                </div>
                                <div className="flex flex-col px-3">
                                    <h3>Black</h3>
                                    <button
                                        onClick={() => [setAiColor("White"), setPieces(blackPlayerBoard)]}
                                        className="w-16 h-16 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200"
                                        >
                                            <img src={symbolMap['dk']}></img>
                                    </button>
                                </div>
                            </div>
                            <div className="flex-auto py-3">
                                <div>
                                    <button 
                                        onClick={() => setIsGameStart(false)}
                                        className="w-24 h-16 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200"
                                        >
                                            Start
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

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
                            const colorPrefix = promotionInfo.color === "White" ? "l" : "d";
                            const pieceKey =
                                type === "kn"
                                ? `${colorPrefix}kn`
                                : type === "b"
                                ? `${colorPrefix}b`
                                : type === "r"
                                ? `${colorPrefix}r`
                                : `${colorPrefix}q`;

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

                {/* Move History */}

                <div className="bg-gray-800 rounded-lg p-3 w-full h-[400px] overflow-y-auto text-sm text-gray-200">
                    {moveHistory.length === 0 ? (
                        <p className="italic text-gray-500">No moves yet...</p>
                    ) : (
                        <ul className="space-y-1">
                        {moveHistory.map((m, i) => (
                            <li key={i} className="flex justify-between">
                            <span>{`${i + 1}. ${m.color === "White" ? "♙" : "♟"} ${m.piece}`}</span>
                            <span>{`${m.from} → ${m.to}${m.captured ? " × " + m.captured : ""}`}</span>
                            </li>
                        ))}
                        </ul>
                    )}
                </div>


            </div>
        </div>
    );
};

export default Board;
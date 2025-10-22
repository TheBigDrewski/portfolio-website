import './App.css';
import Piece from './Piece.jsx';

const Square = ({ color, piece, position, onClick, inCheck }) => {
    return (
        <div
            onClick={(e) => onClick(position, e)}
            className={`
                flex items-center justify-center
                w-full h-full
                ${inCheck ? "ring-4 ring-red-500" : ""}
            `}
            style={{
                backgroundColor: color,
            }}
        >

            {piece && <Piece type={piece.type} />}
        </div>
    );
};

export default Square;
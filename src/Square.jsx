import './App.css';
import Piece from './Piece.jsx';

const Square = ({ color, piece, position, onClick, inCheck }) => {
    return (
        <div
            onClick={(e) => onClick(position, e)}
            className={`
                flex items-center justify-center
                w-full h-full
                ${inCheck ? "ring ring-red-500 ring-inset" : ""}
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
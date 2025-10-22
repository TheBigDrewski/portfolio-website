import './App.css';
import Piece from './Piece.jsx';

const Square = ({ color, piece, position, onClick, inCheck }) => {
    return (
        <div
            onClick={(e) => onClick(position, e)}
            className="square"
            style={{
                width: '64px',
                height: '64px',
                backgroundColor: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',   
                boxSizing: "border-box",
                border: inCheck ? "3px solid red" : "1px solid #333",           
            }}
        >

            {piece && <Piece type={piece.type} />}
        </div>
    );
};

export default Square;
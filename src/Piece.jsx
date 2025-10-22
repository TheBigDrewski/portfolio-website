import dp from './assets/Chess_pdt45.svg.png';
import lp from './assets/Chess_plt45.svg.png';
import dr from './assets/Chess_rdt45.svg.png';
import lr from './assets/Chess_rlt45.svg.png';
import dkn from './assets/Chess_ndt45.svg.png';
import lkn from './assets/Chess_nlt45.svg.png';
import db from './assets/Chess_bdt45.svg.png';
import lb from './assets/Chess_blt45.svg.png';
import dq from './assets/Chess_qdt45.svg.png';
import lq from './assets/Chess_qlt45.svg.png';
import dk from './assets/Chess_kdt45.svg.png';
import lk from './assets/Chess_klt45.svg.png';

const Piece = ({ type }) => {
    const symbolMap = {
        dp: dp,
        lp: lp,
        dr: dr,
        lr: lr,
        dkn: dkn,
        lkn: lkn,
        db: db,
        lb: lb,
        dq: dq,
        lq: lq,
        dk: dk,
        lk: lk,
    };

    const symbolSrc = symbolMap[type];

    if(!symbolSrc) return null;

    return (
        <img
        src={symbolSrc}
        alt={type}
        style={{
            width: '64px',
            height: '64px',
            userSelect: 'none',
        }}
        />
    );
};

export default Piece;
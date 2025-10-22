export const isValidMove = (from, to, piece, pieces, enPassantTarget) => {
        const [fromRow, fromCol] = from.split(",").map(Number);
        const [toRow, toCol] = to.split(",").map(Number);
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);

        //console.log("From: " + from + " To: " + to + " Piece: " + piece.type);

        //Pawn Logic
        if(piece.type === "dp" || piece.type === "lp") {
            const dir = piece.color === "light" ? -1 : 1;
            const startRow = piece.color === "light" ? 6 : 1;
            const oneStep = toRow - fromRow === dir && fromCol === toCol && !pieces[to];
            const twoStep =
                fromRow === startRow &&
                toRow - fromRow === 2 * dir &&
                fromCol === toCol &&
                !pieces[`${fromRow + dir},${fromCol}`] &&
                !pieces[to];
            const capture = 
                toRow - fromRow === dir &&
                Math.abs(toCol - fromCol) === 1 &&
                pieces[to] &&
                pieces[to].color !== piece.color;

            let enPassant = false;
            if (
                toRow - fromRow === dir &&
                Math.abs(toCol - fromCol) === 1 &&
                !pieces[to] &&
                enPassantTarget
            ) {
                const [targetRow, targetCol] = enPassantTarget.split(",").map(Number);
                if(targetRow === toRow && targetCol === toCol) {
                    enPassant = true;
                }
            }

            return oneStep || twoStep || capture || enPassant;
        }
        //Rook Logic
        else if(piece.type === "dr" || piece.type === "lr") {
                const sameRow = fromRow === toRow;
                const sameCol = fromCol === toCol;
                if (!sameRow && !sameCol) return false;

                const rowStep = sameCol ? Math.sign(toRow - fromRow) : 0;
                const colStep = sameRow ? Math.sign(toCol - fromCol) : 0;

                let r = fromRow + rowStep;
                let c = fromCol + colStep;

                while (r !== toRow || c !== toCol) {
                    const key = `${r},${c}`;
                    if (pieces[key]) return false;
                    r += rowStep;
                    c += colStep;
                }

                const target = pieces[to];
                if (target && target.color === piece.color) return false;

                return true;

        }
        //Knight Logic
        else if(piece.type === "dkn" || piece.type === "lkn"){
            if((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)){
                const target = pieces[to];
                if(target && target.color === piece.color) return false;

                return true;
            }
        }
        //Bishop Logic
        else if(piece.type === "db" || piece.type === "lb"){
            if(rowDiff !== colDiff) return false;

            const rowStep = Math.sign(toRow - fromRow);
            const colStep = Math.sign(toCol - fromCol);

            let r = fromRow + rowStep;
            let c = fromCol + colStep;

            while(r !== toRow && c !== toCol){
                const key = `${r},${c}`;
                if(pieces[key]) return false;
                r += rowStep;
                c += colStep;
            }

            const target = pieces[to];
            if (target && target.color === piece.color) return false;

            return true;
        }
        //Queen Logic
        else if(piece.type === "dq" || piece.type === "lq"){
            return (isValidMove(from, to, {...piece, type: "dr"}, pieces) || 
                    isValidMove(from, to, {...piece, type: "lb"}, pieces));
        }
        //King Logic
        else if (piece.type === "dk" || piece.type === "lk") {
            if (rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0)) {
                const target = pieces[to];
                if (target && target.color === piece.color) return false;
                return true;
            }

            if (rowDiff === 0 && colDiff === 2 && !piece.hasMoved) {
                const isKingSide = toCol > fromCol;
                const rookCol = isKingSide ? 7 : 0;
                const rookPos = `${fromRow},${rookCol}`;
                const rook = pieces[rookPos];

                if (
                !rook ||
                (rook.type !== "lr" && rook.type !== "dr") ||
                rook.color !== piece.color ||
                rook.hasMoved
                ) {
                return false;
                }

                const colStep = isKingSide ? 1 : -1;
                for (let c = fromCol + colStep; c !== rookCol; c += colStep) {
                if (pieces[`${fromRow},${c}`]) return false;
                }

                const colsToCheck = isKingSide
                ? [fromCol, fromCol + 1, fromCol + 2]
                : [fromCol, fromCol - 1, fromCol - 2];

                for (const c of colsToCheck) {
                const testBoard = { ...pieces };
                delete testBoard[`${fromRow},${fromCol}`];
                testBoard[`${fromRow},${c}`] = piece;
                if (isKingInCheck(testBoard, piece.color)) return false;
                }

                return true;
            }
        }
        else{
            return false;
        }
    };

export const isKingInCheck = (pieces, color) => {
    let kingPos = null;
    let enPassantTarget = null;
    for (const pos in pieces) {
        const p = pieces[pos];
        if ((p.type === "dk" || p.type === "lk") && p.color === color) {
            kingPos = pos;
            break;
        }
    }

    if(!kingPos) return false;

    for (const pos in pieces) {
        const p = pieces[pos];
        if (p.color !== color) {
            if (isValidMove(pos, kingPos, p, pieces, enPassantTarget)) {
                return true;
            }
        }
    }

    return false;
}
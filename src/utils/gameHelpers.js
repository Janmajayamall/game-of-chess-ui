export function parseBoardString(boardString) {
	const pieceMaps = boardString.split("|");
	const bitboards = [];
	pieceMaps.forEach((map) => {
		bitboards.push(parseInt(map, 2));
	});
	return pieceMapsInt;
}

export const PIECE = {
	p: 0,
	n: 1,
	b: 2,
	r: 3,
	q: 4,
	k: 5,
	P: 6,
	N: 7,
	B: 8,
	R: 9,
	Q: 10,
	K: 11,
    uk:12
};

/**
 *
 * GameState
 * bitboards
 * castle rights
 * enpassant sqaure
 * move count & halfmove count
 * and rest same is sol
 * 
 * Move
 * side, moveCount
 *
 */

export const FILE_VALIDATION = {
 notAFile:18374403900871474942,
        notHFile: 9187201950435737471,
 notHGFile : 4557430888798830399,
 notABFile : 18229723555195321596
} 

export const MOVE_FLAG = {
    NoCastle:0,
    Castle:1,
    PawnPromotion: 2
}

export function getBlockerboard(bitboards){
    let blockerboard = 0;
    bitboards.forEach(board=>{
        blockerboard = blockerboard | board
    })
    return blockerboard;
}

export function isSquareAttacked(square, sourcePiece, bitboards, blockerboard){

}

export function isMoveValid(move, gameState) {
    if (gameState.state != 1){
            return false;
        }

        if (move.side != gameState.side) {
            return false;
        }

        if (gameState.moveCount + 1 != move.moveCount){
            return false;
        }

        // source piece should match playing side
        if (gameState.side == 0 && move.sourcePiece < 6 ){
            // sourcePiece is black, when side is white
            return false;
        }
        if (gameState.side == 1 && move.sourcePiece >= 6){
            // sourcePiece is white, when side is black
            return false;
        }

        // target piece cannot be of playiing side
        if (gameState.side == 0 && move.targetPiece != PIECE.uk && move.targetPiece >= 6){
            return false;
        }
        if (gameState.side == 1 && move.targetPiece < 6){
            return false;
        }

        let blockerboard = getBlockerboard(gameState.bitboards);

        if (move.moveFlag == MOVE_FLAG.Castle){
            if (move.sourcePiece != PIECE.K && move.sourcePiece != PIECE.k){
                return false;
            }

            // white king
            if (move.sourcePiece == IGocDataTypes.Piece.K){
                // king should be on original pos
                if (move.sourceSq != 60){
                    return false;
                }

                // targetSq can only be 62 or 58
                if (move.targetSq != 62 && move.targetSq != 58){
                    return false;
                }

                // king side castling
                if (move.targetSq == 62){
                    if (gameState.wkC == false){
                        return false;
                    }

                    // rook should be on original pos
                    if (1 << 63 & gameState.bitboards[PIECE.R] == 0){
                        return false;
                    }

                    // no attacks to king and thru passage
                    if (
                        isSquareAttacked(60, move.sourcePiece, gameState.bitboards, blockerboard) ||
                        isSquareAttacked(61, move.sourcePiece, gameState.bitboards, blockerboard) ||
                        isSquareAttacked(62, move.sourcePiece, gameState.bitboards, blockerboard)
                    ){
                        return false;
                    }

                    // passage should be empty
                    if (
                        1 << 61 & blockerboard != 0 ||
                        1 << 62 & blockerboard != 0
                    ){
                        return false;
                    }
                }

                // queen side castling
                if (move.targetSq == 58){
                    if (gameState.wqC == false){
                        return false;
                    }
                    
                    // rook should on original pos
                    if (1 << 56 & gameState.bitboards[PIECE.R] == 0){
                        return false;
                    }

                    // no attacks to king and thru passage
                    if (
                        isSquareAttacked(60, move.sourcePiece, gameState.bitboards, blockerboard) ||
                        isSquareAttacked(59, move.sourcePiece, gameState.bitboards, blockerboard) ||
                        isSquareAttacked(58, move.sourcePiece, gameState.bitboards, blockerboard)
                    ){
                        return false;
                    }

                    // passage should be empty
                    if (
                        1 << 57 & blockerboard != 0 ||
                        1 << 58 & blockerboard != 0 ||
                        1 << 59 & blockerboard != 0
                    ){
                        return false;
                    }
                }
                
            }

            // black king
            if (move.sourcePiece == PIECE.k){
                // king should on original pos
                if (move.sourceSq != 4){
                    return false;
                }

                // targetSq can only be 2 or 6
                if (move.targetSq != 2 && move.targetSq != 6){
                    return false;
                }

                // king side castling
                if (move.targetSq == 6){
                    if (gameState.bkC == false){
                        return false;
                    }

                    // rook should be on 7
                    if ((1 << 7) & gameState.bitboards[PIECE.r] == 0){
                        return false;
                    }

                    // no attacks on king sq & thru sqaures
                    if (
                        isSquareAttacked(4, move.sourcePiece, gameState.bitboards, blockerboard) ||
                        isSquareAttacked(5, move.sourcePiece, gameState.bitboards, blockerboard) ||
                        isSquareAttacked(6, move.sourcePiece, gameState.bitboards, blockerboard) 
                    ){
                        return false;
                    }

                    // passage should be empty
                    if (
                        1 << 5 & blockerboard != 0 ||
                        1 << 6 & blockerboard != 0
                    ){
                        return false;
                    }
                }


                // queen side castling
                if (move.targetSq == 2){
                    if (gameState.bqC == false){
                        return false;
                    }

                    // rook should be on 0 
                    if (1 & gameState.bitboards[PIECE.r] == 0){
                        return false;
                    }

                    // no attacks on king sq & thru squares
                    if (
                        isSquareAttacked(4, move.sourcePiece, gameState.bitboards, blockerboard) ||
                        isSquareAttacked(3, move.sourcePiece, gameState.bitboards, blockerboard) ||
                        isSquareAttacked(2, move.sourcePiece, gameState.bitboards, blockerboard) 
                    ){
                        return false;
                    }

                    // passage should be empty
                    if (
                        1 << 3 & blockerboard != 0 ||
                        1 << 2 & blockerboard != 0 ||
                        1 << 1 & blockerboard != 0
                    ){
                        return false;
                    }
                }
            }
        }

        // king
        if ((move.sourcePiece == PIECE.K || move.sourcePiece == PIECE.k) && move.moveFlag == MOVE_FLAG.NoFlag){
            // moveBy can only be 8, 9, 7, 1
            if (move.moveBySq != 8 && move.moveBySq != 9 && move.moveBySq != 7 && move.moveBySq != 1){
                return false;
            }

            // downwards
            if (move.moveLeftShift == true){
                // can only move inside the board
                if (move.sourcePieceBitBoard << move.moveBySq == 0){
                    return false;
                }

                // check falling off right edge
                if (move.moveBySq == 9 && (move.sourcePieceBitBoard << 9 & notAFile) == 0){
                    return false;
                }

                // check falling off left edge
                if (move.moveBySq == 7 && (move.sourcePieceBitBoard << 7 & notHFile) == 0){
                    return false;
                }
            }

            // upwards
            if (move.moveLeftShift == false){
                // can only move inside the board
                if (move.sourcePieceBitBoard >> move.moveBySq == 0){
                    return false;
                }

                // check falling off right edge
                if (move.moveBySq == 7 && (move.sourcePieceBitBoard >> 7 & notAFile) == 0){
                    return false;
                }

                // check falling off left edge 
                if (move.moveBySq == 9 && (move.sourcePieceBitBoard >> 9 & notHFile) == 0){
                    return false;
                }
            }
        }

        // knight
        if ((move.sourcePiece == PIECE.N || move.sourcePiece == PIECE.n) && move.moveFlag == MOVE_FLAG.NoFlag) {
            if (move.moveBySq != 17 && move.moveBySq != 15 && move.moveBySq != 6 && move.moveBySq != 10) {
                return false;
            }

            // downwards
            if (move.moveLeftShift == true){
                // check falling off right edge
                if (move.moveBySq == 17 && (move.sourcePieceBitBoard << 17 & notAFile) == 0){
                    return false;
                }

                // check falling off right edge (2 lvl deep)
                if (move.moveBySq == 10 && (move.sourcePieceBitBoard << 10 & notABFile) == 0){
                    return false;
                }

                // check falling off left edge
                if (move.moveBySq == 15 && (move.sourcePieceBitBoard << 15 & notHFile) == 0){
                    return false;
                }

                // check falling off left edge (2 lvl deep)
                if (move.moveBySq == 6 && (move.sourcePieceBitBoard << 6 & notHGFile) == 0){
                    return false;
                }
            }

            // upwards
            if (move.moveLeftShift == false){
                // check falling off right edge
                if (move.moveBySq == 15 && (move.sourcePieceBitBoard >> 15 & notAFile) == 0){
                    return false;
                }

                // check falling off right edgen (2 lvl deep)
                if (move.moveBySq == 6 && (move.sourcePieceBitBoard >> 6 & notABFile) == 0){
                    return false;
                }

                // check falling off left edge
                if (move.moveBySq == 17 && (move.sourcePieceBitBoard >> 17 & notHFile) == 0){
                    return false;
                }

                // check falling off left edge (2 lvl deep)
                if (move.moveBySq == 10 && (move.sourcePieceBitBoard >> 10 & notHGFile) == 0){
                    return false;
                }
            }

        }
        
        // white & black pawns
        if ((move.sourcePiece == PIECE.P || move.sourcePiece == PIECE.p) && (move.moveFlag == MOVE_FLAG.NoFlag || move.moveFlag == MOVE_FLAG.PawnPromotion)){
            // white pawns can only move upwards & black pawns can only move downwards
            if (
                (move.sourcePiece != PIECE.P || move.moveLeftShift != false) &&
                (move.sourcePiece != PIECE.p || move.moveLeftShift != true)
            ){
                return false;
            }

            // diagonal move (i.e.) attack
            if (move.moveBySq == 9 || move.moveBySq == 7){
                // can only move diagonal if target piece present || it is a enpassant sq
                if (move.targetPiece == PIECE.uk && move.targetSq != gameState.enpassantSq){
                    return false;
                }

                // white pawns
                if (move.sourcePiece == PIECE.P){
                    // check falling off right edge
                    if (move.moveBySq == 7 && (move.sourcePieceBitBoard >> 7 & notAFile) == 0){
                        return false;
                    }
                    // check falling off left edge
                    if (move.moveBySq == 9 && (move.sourcePieceBitBoard >> 9 & notHFile) == 0){
                        return false;
                    }
                }
                // black pawns
                else if(move.sourcePiece == PIECE.p){
                    // check falling off right edge
                    if (move.moveBySq == 9 && (move.sourcePieceBitBoard << 9 & notAFile) == 0){
                        return false;
                    }

                    // check falling off right edge
                    if (move.moveBySq == 7 && (move.sourcePieceBitBoard << 7 & notHFile) == 0){
                        return false;
                    }
                }
            }else if (move.moveBySq == 8){
                // targetSq should be empty
                if (move.targetPiece != PIECE.uk){
                    return false;
                }

                // cannot go out of the board;
                // up
                if (move.sourcePieceBitBoard >> move.moveBySq == 0){
                    return false;
                }
                // down
                if (move.sourcePieceBitBoard << move.moveBySq == 0){
                    return false;
                }
            }else if (move.moveBySq == 16) {
                // target sq should be empty 
                if (move.targetPiece != IGocDataTypes.Piece.uk){
                    return false;
                }

                // pawn shouldn't have moved before
                // 71776119061217280 is initial pos of white pawns on board
                // 65280 is initial pos of black pawns on board
                if ((move.sourcePiece != PIECE.P || move.sourcePieceBitBoard & 71776119061217280 == 0) && 
                    (move.sourcePiece != PIECE.p || move.sourcePieceBitBoard & 65280 == 0) 
                ){
                    return false;
                }
            }
            else {
                return false;
            }

            // check for promotion
            if (move.moveFlag == MOVE_FLAG.PawnPromotion){
                // promoted piece cannot be unkown, pawn, or king
                if (
                    move.promotedToPiece == PIECE.uk || 
                    move.promotedToPiece == PIECE.p || 
                    move.promotedToPiece == PIECE.P || 
                    move.promotedToPiece == PIECE.k || 
                    move.promotedToPiece == PIECE.K  
                ){
                    return false;
                }

                // white cannot promote black pice & vice versa
                if ((move.sourcePiece != PIECE.P || move.promotedToPiece < 6) && (move.sourcePiece != PIECE.p || move.promotedToPiece >= 6)){
                    return false;
                }

                // current rank should be 1 or 6
                let rank = move.sourceSq / 8;
                if ((move.sourcePiece != PIECE.P || rank != 1) && (move.sourcePiece != PIECE.p || rank != 6)){
                    return false;
                }
            }
        }   

        // bishop & possibly queen
        if (
            (
                (move.sourcePiece == IGocDataTypes.Piece.B || move.sourcePiece == IGocDataTypes.Piece.b) || 
                (
                    // queen moves like a bishop if both rank and file of source & target don't match
                    (move.sourcePiece == IGocDataTypes.Piece.Q || move.sourcePiece == IGocDataTypes.Piece.q) 
                    && (move.sourceSq % 8 != move.targetSq % 8)
                    && (move.sourceSq / 8 != move.targetSq / 8)
                )
            )
            && move.moveFlag == IGocDataTypes.MoveFlag.NoFlag
            ) 
        {
            let sr = move.sourceSq / 8; 
            uint sf = move.sourceSq % 8;
            uint tr = move.targetSq / 8; 
            uint tf = move.targetSq % 8;
            
            bool targetFound = false;

            // check target is daigonal & there exist no blockers
            if (sr < tr && sf < tf){
                uint r = sr + 1;
                uint f = sf + 1;
                while (r <= 7 && f <= 7){
                    uint sq = (r * 8) + f;

                    if (sq == move.targetSq){
                        targetFound = true;
                        break;
                    }

                    // check whether blocker exists
                    if ((uint(1) << sq & blockerboard) > 0){
                        break;
                    }

                    r += 1;
                    f += 1;
                }
            }
            if (sr < tr && sf > tf) {
                uint r = sr + 1;
                uint f = sf - 1;
                while (r <= 7 && f >= 0){
                    uint sq = (r * 8) + f;

                    if (sq == move.targetSq){
                        targetFound = true;
                        break;
                    }

                    // check whether blocker exists
                    if ((uint(1) << sq & blockerboard) > 0){
                        break;
                    }

                    r += 1;
                    if (f == 0){
                        break;
                    }
                    f -= 1;
                }
            }
            if (sr > tr && sf > tf) {
                uint r = sr - 1;
                uint f = sf - 1;
                while (r >= 0 && f >= 0){
                    uint sq = (r * 8) + f;

                    if (sq == move.targetSq){
                        targetFound = true;
                        break;
                    }

                    // check whether blocker exists
                    if ((uint(1) << sq & blockerboard) > 0){
                        break;
                    }

                    if (r == 0 || f == 0){
                        break;
                    }
                    r -= 1;
                    f -= 1;
                }
            }
            if (sr > tr && sf < tf){
                uint r = sr - 1;
                uint f = sf + 1;
                while (r >= 0 && f <= 7){
                    uint sq = (r * 8) + f;
                    
                    if (sq == move.targetSq){
                        targetFound = true;
                        break;
                    }

                    // check whether blocker exists
                    if ((uint(1) << sq & blockerboard) > 0){
                        break;
                    }

                    if (r == 0){
                        break;
                    }
                    r -= 1;
                    f += 1;
                }
            }

            // if targetSq not found, then targetSq isn't positioned diagonally to bishop's pos
            require(targetFound);
        }

        // rook & possibly queen
        if (
            (
                (move.sourcePiece == IGocDataTypes.Piece.R || move.sourcePiece == IGocDataTypes.Piece.r) || 
                (
                    // queen moves like a rook if both either of rank and file of source & target match
                    (move.sourcePiece == IGocDataTypes.Piece.Q || move.sourcePiece == IGocDataTypes.Piece.q) 
                    && ((move.sourceSq % 8 == move.targetSq % 8)
                        || (move.sourceSq / 8 == move.targetSq / 8))
                )
            )
            && move.moveFlag == IGocDataTypes.MoveFlag.NoFlag
            ) 
        {
            uint sr = move.sourceSq / 8; 
            uint sf = move.sourceSq % 8;
            uint tr = move.targetSq / 8; 
            uint tf = move.targetSq % 8;
            
            bool targetFound = false;

            // target sq should be either in same file or rank & should not contains any blockers
            if (sr == tr && sf < tf){
                uint f = sf + 1;
                while (f <= 7){
                    uint sq = (sr * 8) + f;

                    if (sq == move.targetSq){
                        targetFound = true;
                        break;
                    }

                    // check whether blocker exists
                    if ((uint(1) << sq & blockerboard) > 0){
                        break;
                    }

                    f += 1;
                }
            }
            if (sr == tr && sf > tf && sf != 0) {
                uint f = sf - 1;
                while (f >= 0){
                    uint sq = (sr * 8) + f;

                    if (sq == move.targetSq){
                        targetFound = true;
                        break;
                    }

                    // check whether blocker exists
                    if ((uint(1) << sq & blockerboard) > 0){
                        break;
                    }

                    if (f == 0){
                        break;
                    }
                    f -= 1;
                }
            }
            if (sr > tr && sf == tf && sr != 0) {
                uint r = sr - 1;
                while (r >= 0){
                    uint sq = (r * 8) + sf;

                    if (sq == move.targetSq){
                        targetFound = true;
                        break;
                    }

                    // check whether blocker exists
                    if ((uint(1) << sq & blockerboard) > 0){
                        break;
                    }

                    if (r == 0){
                        break;
                    }
                    r -= 1;
                }
            }
            if (sr < tr && sf == tf){
                uint r = sr + 1;
                while (r <= 7){
                    uint sq = (r * 8) + sf;
                    
                    if (sq == move.targetSq){
                        targetFound = true;
                        break;
                    }

                    // check whether blocker exists
                    if ((uint(1) << sq & blockerboard) > 0){
                        break;
                    }
                    r += 1;
                }
            }


            // if targetSq not found, then targetSq isn't valid
            if (targetFound == false) return false;
        }

        return true;
}
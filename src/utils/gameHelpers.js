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
	uk: 12,
};

export const FILE_VALIDATION = {
	notAFile: 18374403900871474942,
	notHFile: 9187201950435737471,
	notHGFile: 4557430888798830399,
	notABFile: 18229723555195321596,
};

export const MOVE_FLAG = {
	NoCastle: 0,
	Castle: 1,
	PawnPromotion: 2,
};

export function getBlockerboard(bitboards) {
	let blockerboard = 0;
	bitboards.forEach((board) => {
		blockerboard = blockerboard | board;
	});
	return blockerboard;
}

export function getBishopAttacks(
	attackingPiece,
	square,
	blockboard,
	bitboards
) {
	let sr = square / 8;
	let sf = square % 8;

	let r = sr + 1;
	let f = sf + 1;

	// potential attacking sqaures
	let aBishopB = bitboards[attackingPiece];
	let attacks = 0;
	while (r <= 7 && f <= 7) {
		let sq = r * 8 + f;
		let sqPosB = 1 << sq;

		if (sqPosB & (aBishopB != 0)) {
			attacks |= sqPosB;
			break;
		} else if (sqPosB & (blockboard != 0)) break;

		r += 1;
		f += 1;
	}

	r = sr + 1;
	f = sf - 1;
	while (r <= 7 && f >= 0) {
		let sq = r * 8 + f;
		let sqPosB = 1 << sq;

		if (sqPosB & (aBishopB != 0)) {
			attacks |= sqPosB;
			break;
		} else if (sqPosB & (blockboard != 0)) break;

		r += 1;
		f -= 1;
	}

	r = sr - 1;
	f = sf + 1;
	while (f <= 7) {
		let sq = r * 8 + f;
		let sqPosB = 1 << sq;

		if (sqPosB & (aBishopB != 0)) {
			attacks |= sqPosB;
			break;
		} else if (sqPosB & (blockboard != 0)) break;

		f += 1;
		r -= 1;
	}

	r = sr - 1;
	f = sf - 1;
	while (true) {
		let sq = r * 8 + f;
		let sqPosB = 1 << sq;

		if (sqPosB & (aBishopB != 0)) {
			attacks |= sqPosB;
			break;
		} else if (sqPosB & (blockboard != 0)) break;

		r -= 1;
		f -= 1;
	}
	return attacks;
}

export function getRookAttacks(attackingPiece, square, blockboard, bitboards) {
	let sr = square / 8;
	let sf = square % 8;

	let r = sr + 1;
	let f;

	// potential attacking sqaures
	let aRookB = bitboards[attackingPiece];
	let attacks;
	while (r <= 7) {
		let sq = r * 8 + sf;
		let sqPosB = 1 << sq;

		if (aRookB & (sqPosB != 0)) {
			attacks |= sqPosB;
			break;
		} else if (sqPosB & (blockboard != 0)) break;

		r += 1;
	}

	f = sf + 1;
	while (f <= 7) {
		let sq = sr * 8 + f;
		let sqPosB = 1 << sq;

		if (aRookB & (sqPosB != 0)) {
			attacks |= sqPosB;
			break;
		} else if (sqPosB & (blockboard != 0)) break;

		attacks |= sqPosB;
		f += 1;
	}

	r = sr - 1;
	while (r >= 0) {
		let sq = r * 8 + sf;
		let sqPosB = 1 << sq;

		if (aRookB & (sqPosB != 0)) {
			attacks |= sqPosB;
			break;
		} else if (sqPosB & (blockboard != 0)) break;

		attacks |= sqPosB;
		r -= 1;
	}

	f = sf - 1;
	while (f >= 0) {
		let sq = sr * 8 + f;
		let sqPosB = 1 << sq;

		if (aRookB & (sqPosB != 0)) {
			attacks |= sqPosB;
			break;
		} else if (sqPosB & (blockboard != 0)) break;

		attacks |= sqPosB;

		f -= 1;
	}
	return attacks;
}

export function getPawnAttacks(square, side) {
	let sqBitboard = 1 << square;
	let attacks = 0;
	// white pawn
	if (side == 0) {
		if ((sqBitboard >> 7) & (FILE_VALIDATION.notAFile != 0))
			attacks |= sqBitboard >> 7;
		if ((sqBitboard >> 9) & (FILE_VALIDATION.notHFile != 0))
			attacks |= sqBitboard >> 9;
	}
	// black pawn
	else {
		if ((sqBitboard << 9) & (FILE_VALIDATION.notAFile != 0))
			attacks |= sqBitboard << 9;
		if ((sqBitboard << 7) & (FILE_VALIDATION.notHFile != 0))
			attacks |= sqBitboard << 7;
	}
	return attacks;
}

export function getKingAttacks(square) {
	let sqBitboard = 1 << square;
	let attacks;
	// upwards
	if (sqBitboard >> 8 != 0) attacks |= sqBitboard >> 8;
	if ((sqBitboard >> 9) & (FILE_VALIDATION.notHFile != 0))
		attacks |= sqBitboard >> 9;
	if ((sqBitboard >> 7) & (FILE_VALIDATION.notAFile != 0))
		attacks |= sqBitboard >> 7;
	if ((sqBitboard >> 1) & (FILE_VALIDATION.notHFile != 0))
		attacks |= sqBitboard >> 1;

	// downwards
	if (sqBitboard << 8 != 0) attacks |= sqBitboard << 8;
	if ((sqBitboard << 9) & (FILE_VALIDATION.notAFile != 0))
		attacks |= sqBitboard << 9;
	if ((sqBitboard << 7) & (FILE_VALIDATION.notHFile != 0))
		attacks |= sqBitboard << 7;
	if ((sqBitboard << 1) & (FILE_VALIDATION.notAFile != 0))
		attacks |= sqBitboard << 1;

	return attacks;
}

export function getKnightAttacks(square) {
	let sqBitboard = 1 << square;
	let attacks = 0;
	// upwards
	if ((sqBitboard >> 15) & (FILE_VALIDATION.FILE_VALIDATION.notAFile != 0))
		attacks |= sqBitboard >> 15;
	if ((sqBitboard >> 17) & (FILE_VALIDATION.notHFile != 0))
		attacks |= sqBitboard >> 17;
	if ((sqBitboard >> 6) & (FILE_VALIDATION.notABFile != 0))
		attacks |= sqBitboard >> 6;
	if ((sqBitboard >> 10) & (FILE_VALIDATION.notHGFile != 0))
		attacks |= sqBitboard >> 10;

	// downwards
	if ((sqBitboard << 15) & (FILE_VALIDATION.notHFile != 0))
		attacks |= sqBitboard << 15;
	if ((sqBitboard << 17) & (FILE_VALIDATION.notAFile != 0))
		attacks |= sqBitboard << 17;
	if ((sqBitboard << 6) & (FILE_VALIDATION.notHGFile != 0))
		attacks |= sqBitboard << 6;
	if ((sqBitboard << 10) & (FILE_VALIDATION.notABFile != 0))
		attacks |= sqBitboard << 10;

	return attacks;
}

export function isSquareAttacked(square, piece, bitboards, blockboard) {
	if (piece == PIECE.uk) {
		return false;
	}

	let side;
	if (piece < 6) {
		side = 1;
	}

	// check black pawn attacks on sq
	if (side == 0 && getPawnAttacks(square, side) & (bitboards[PIECE.p] != 0)) {
		return true;
	}

	// check white pawn attacks on sq
	if (side == 1 && getPawnAttacks(square, side) & (bitboards[PIECE.P] != 0)) {
		return true;
	}

	// check kings attacks on sq
	if (
		getKingAttacks(square) &
		((side == 0 ? bitboards[PIECE.k] : bitboards[PIECE.K]) != 0)
	) {
		return true;
	}

	// check knight attacks on sq
	if (
		getKnightAttacks(square) &
		((side == 0 ? bitboards[PIECE.n] : bitboards[PIECE.N]) != 0)
	) {
		return true;
	}

	// bishop attacks on sq
	let bishopAttacks = getBishopAttacks(
		side == 0 ? PIECE.b : PIECE.B,
		square,
		blockboard,
		bitboards
	);
	if (bishopAttacks != 0) {
		return true;
	}

	// rook attacks on sq
	let rookAttacks = getRookAttacks(
		side == 0 ? PIECE.r : PIECE.R,
		square,
		blockboard,
		bitboards
	);
	if (rookAttacks != 0) {
		return true;
	}

	// queen attacks on sq
	let queenAttacks =
		getBishopAttacks(
			side == 0 ? PIECE.q : PIECE.Q,
			square,
			blockboard,
			bitboards
		) |
		getRookAttacks(
			side == 0 ? PIECE.q : PIECE.Q,
			square,
			blockboard,
			bitboards
		);
	if (queenAttacks != 0) {
		return true;
	}

	return false;
}

export function convertMoveObjToMoveValue(move) {
	let moveValue = 0;
	moveValue |= move.moveCount << 36;
	moveValue |= move.gameId << 20;
	moveValue |= move.side << 17;
	if (move.moveFlag == MOVE_FLAG.Castle) {
		moveValue |= 1 << 16;
	}
	moveValue |= promotedPiece << 12;
	moveValue |= targetSq << 6;
	moveValue |= sourceSq;
	return moveValue;
}

export function isMoveValid(move, gameState) {
	if (gameState.state != 1) {
		return false;
	}

	if (move.side != gameState.side) {
		return false;
	}

	if (gameState.moveCount + 1 != move.moveCount) {
		return false;
	}

	// source piece should match playing side
	if (gameState.side == 0 && move.sourcePiece < 6) {
		// sourcePiece is black, when side is white
		return false;
	}
	if (gameState.side == 1 && move.sourcePiece >= 6) {
		// sourcePiece is white, when side is black
		return false;
	}

	// target piece cannot be of playiing side
	if (
		gameState.side == 0 &&
		move.targetPiece != PIECE.uk &&
		move.targetPiece >= 6
	) {
		return false;
	}
	if (gameState.side == 1 && move.targetPiece < 6) {
		return false;
	}

	let blockerboard = getBlockerboard(gameState.bitboards);

	if (move.moveFlag == MOVE_FLAG.Castle) {
		if (move.sourcePiece != PIECE.K && move.sourcePiece != PIECE.k) {
			return false;
		}

		// white king
		if (move.sourcePiece == IGocDataTypes.Piece.K) {
			// king should be on original pos
			if (move.sourceSq != 60) {
				return false;
			}

			// targetSq can only be 62 or 58
			if (move.targetSq != 62 && move.targetSq != 58) {
				return false;
			}

			// king side castling
			if (move.targetSq == 62) {
				if (gameState.wkC == false) {
					return false;
				}

				// rook should be on original pos
				if ((1 << 63) & (gameState.bitboards[PIECE.R] == 0)) {
					return false;
				}

				// no attacks to king and thru passage
				if (
					isSquareAttacked(
						60,
						move.sourcePiece,
						gameState.bitboards,
						blockerboard
					) ||
					isSquareAttacked(
						61,
						move.sourcePiece,
						gameState.bitboards,
						blockerboard
					) ||
					isSquareAttacked(
						62,
						move.sourcePiece,
						gameState.bitboards,
						blockerboard
					)
				) {
					return false;
				}

				// passage should be empty
				if (
					(1 << 61) & (blockerboard != 0) ||
					(1 << 62) & (blockerboard != 0)
				) {
					return false;
				}
			}

			// queen side castling
			if (move.targetSq == 58) {
				if (gameState.wqC == false) {
					return false;
				}

				// rook should on original pos
				if ((1 << 56) & (gameState.bitboards[PIECE.R] == 0)) {
					return false;
				}

				// no attacks to king and thru passage
				if (
					isSquareAttacked(
						60,
						move.sourcePiece,
						gameState.bitboards,
						blockerboard
					) ||
					isSquareAttacked(
						59,
						move.sourcePiece,
						gameState.bitboards,
						blockerboard
					) ||
					isSquareAttacked(
						58,
						move.sourcePiece,
						gameState.bitboards,
						blockerboard
					)
				) {
					return false;
				}

				// passage should be empty
				if (
					(1 << 57) & (blockerboard != 0) ||
					(1 << 58) & (blockerboard != 0) ||
					(1 << 59) & (blockerboard != 0)
				) {
					return false;
				}
			}
		}

		// black king
		if (move.sourcePiece == PIECE.k) {
			// king should on original pos
			if (move.sourceSq != 4) {
				return false;
			}

			// targetSq can only be 2 or 6
			if (move.targetSq != 2 && move.targetSq != 6) {
				return false;
			}

			// king side castling
			if (move.targetSq == 6) {
				if (gameState.bkC == false) {
					return false;
				}

				// rook should be on 7
				if ((1 << 7) & (gameState.bitboards[PIECE.r] == 0)) {
					return false;
				}

				// no attacks on king sq & thru sqaures
				if (
					isSquareAttacked(
						4,
						move.sourcePiece,
						gameState.bitboards,
						blockerboard
					) ||
					isSquareAttacked(
						5,
						move.sourcePiece,
						gameState.bitboards,
						blockerboard
					) ||
					isSquareAttacked(
						6,
						move.sourcePiece,
						gameState.bitboards,
						blockerboard
					)
				) {
					return false;
				}

				// passage should be empty
				if (
					(1 << 5) & (blockerboard != 0) ||
					(1 << 6) & (blockerboard != 0)
				) {
					return false;
				}
			}

			// queen side castling
			if (move.targetSq == 2) {
				if (gameState.bqC == false) {
					return false;
				}

				// rook should be on 0
				if (1 & (gameState.bitboards[PIECE.r] == 0)) {
					return false;
				}

				// no attacks on king sq & thru squares
				if (
					isSquareAttacked(
						4,
						move.sourcePiece,
						gameState.bitboards,
						blockerboard
					) ||
					isSquareAttacked(
						3,
						move.sourcePiece,
						gameState.bitboards,
						blockerboard
					) ||
					isSquareAttacked(
						2,
						move.sourcePiece,
						gameState.bitboards,
						blockerboard
					)
				) {
					return false;
				}

				// passage should be empty
				if (
					(1 << 3) & (blockerboard != 0) ||
					(1 << 2) & (blockerboard != 0) ||
					(1 << 1) & (blockerboard != 0)
				) {
					return false;
				}
			}
		}
	}

	// king
	if (
		(move.sourcePiece == PIECE.K || move.sourcePiece == PIECE.k) &&
		move.moveFlag == MOVE_FLAG.NoFlag
	) {
		// moveBy can only be 8, 9, 7, 1
		if (
			move.moveBySq != 8 &&
			move.moveBySq != 9 &&
			move.moveBySq != 7 &&
			move.moveBySq != 1
		) {
			return false;
		}

		// downwards
		if (move.moveLeftShift == true) {
			// can only move inside the board
			if (move.sourcePieceBitBoard << move.moveBySq == 0) {
				return false;
			}

			// check falling off right edge
			if (
				move.moveBySq == 9 &&
				((move.sourcePieceBitBoard << 9) & notAFile) == 0
			) {
				return false;
			}

			// check falling off left edge
			if (
				move.moveBySq == 7 &&
				((move.sourcePieceBitBoard << 7) & notHFile) == 0
			) {
				return false;
			}
		}

		// upwards
		if (move.moveLeftShift == false) {
			// can only move inside the board
			if (move.sourcePieceBitBoard >> move.moveBySq == 0) {
				return false;
			}

			// check falling off right edge
			if (
				move.moveBySq == 7 &&
				((move.sourcePieceBitBoard >> 7) & notAFile) == 0
			) {
				return false;
			}

			// check falling off left edge
			if (
				move.moveBySq == 9 &&
				((move.sourcePieceBitBoard >> 9) & notHFile) == 0
			) {
				return false;
			}
		}
	}

	// knight
	if (
		(move.sourcePiece == PIECE.N || move.sourcePiece == PIECE.n) &&
		move.moveFlag == MOVE_FLAG.NoFlag
	) {
		if (
			move.moveBySq != 17 &&
			move.moveBySq != 15 &&
			move.moveBySq != 6 &&
			move.moveBySq != 10
		) {
			return false;
		}

		// downwards
		if (move.moveLeftShift == true) {
			// check falling off right edge
			if (
				move.moveBySq == 17 &&
				((move.sourcePieceBitBoard << 17) & notAFile) == 0
			) {
				return false;
			}

			// check falling off right edge (2 lvl deep)
			if (
				move.moveBySq == 10 &&
				((move.sourcePieceBitBoard << 10) & notABFile) == 0
			) {
				return false;
			}

			// check falling off left edge
			if (
				move.moveBySq == 15 &&
				((move.sourcePieceBitBoard << 15) & notHFile) == 0
			) {
				return false;
			}

			// check falling off left edge (2 lvl deep)
			if (
				move.moveBySq == 6 &&
				((move.sourcePieceBitBoard << 6) & notHGFile) == 0
			) {
				return false;
			}
		}

		// upwards
		if (move.moveLeftShift == false) {
			// check falling off right edge
			if (
				move.moveBySq == 15 &&
				((move.sourcePieceBitBoard >> 15) & notAFile) == 0
			) {
				return false;
			}

			// check falling off right edgen (2 lvl deep)
			if (
				move.moveBySq == 6 &&
				((move.sourcePieceBitBoard >> 6) & notABFile) == 0
			) {
				return false;
			}

			// check falling off left edge
			if (
				move.moveBySq == 17 &&
				((move.sourcePieceBitBoard >> 17) & notHFile) == 0
			) {
				return false;
			}

			// check falling off left edge (2 lvl deep)
			if (
				move.moveBySq == 10 &&
				((move.sourcePieceBitBoard >> 10) & notHGFile) == 0
			) {
				return false;
			}
		}
	}

	// white & black pawns
	if (
		(move.sourcePiece == PIECE.P || move.sourcePiece == PIECE.p) &&
		(move.moveFlag == MOVE_FLAG.NoFlag ||
			move.moveFlag == MOVE_FLAG.PawnPromotion)
	) {
		// white pawns can only move upwards & black pawns can only move downwards
		if (
			(move.sourcePiece != PIECE.P || move.moveLeftShift != false) &&
			(move.sourcePiece != PIECE.p || move.moveLeftShift != true)
		) {
			return false;
		}

		// diagonal move (i.e.) attack
		if (move.moveBySq == 9 || move.moveBySq == 7) {
			// can only move diagonal if target piece present || it is a enpassant sq
			if (
				move.targetPiece == PIECE.uk &&
				move.targetSq != gameState.enpassantSq
			) {
				return false;
			}

			// white pawns
			if (move.sourcePiece == PIECE.P) {
				// check falling off right edge
				if (
					move.moveBySq == 7 &&
					((move.sourcePieceBitBoard >> 7) & notAFile) == 0
				) {
					return false;
				}
				// check falling off left edge
				if (
					move.moveBySq == 9 &&
					((move.sourcePieceBitBoard >> 9) & notHFile) == 0
				) {
					return false;
				}
			}
			// black pawns
			else if (move.sourcePiece == PIECE.p) {
				// check falling off right edge
				if (
					move.moveBySq == 9 &&
					((move.sourcePieceBitBoard << 9) & notAFile) == 0
				) {
					return false;
				}

				// check falling off right edge
				if (
					move.moveBySq == 7 &&
					((move.sourcePieceBitBoard << 7) & notHFile) == 0
				) {
					return false;
				}
			}
		} else if (move.moveBySq == 8) {
			// targetSq should be empty
			if (move.targetPiece != PIECE.uk) {
				return false;
			}

			// cannot go out of the board;
			// up
			if (move.sourcePieceBitBoard >> move.moveBySq == 0) {
				return false;
			}
			// down
			if (move.sourcePieceBitBoard << move.moveBySq == 0) {
				return false;
			}
		} else if (move.moveBySq == 16) {
			// target sq should be empty
			if (move.targetPiece != IGocDataTypes.Piece.uk) {
				return false;
			}

			// pawn shouldn't have moved before
			// 71776119061217280 is initial pos of white pawns on board
			// 65280 is initial pos of black pawns on board
			if (
				(move.sourcePiece != PIECE.P ||
					move.sourcePieceBitBoard & (71776119061217280 == 0)) &&
				(move.sourcePiece != PIECE.p ||
					move.sourcePieceBitBoard & (65280 == 0))
			) {
				return false;
			}
		} else {
			return false;
		}

		// check for promotion
		if (move.moveFlag == MOVE_FLAG.PawnPromotion) {
			// promoted piece cannot be unkown, pawn, or king
			if (
				move.promotedToPiece == PIECE.uk ||
				move.promotedToPiece == PIECE.p ||
				move.promotedToPiece == PIECE.P ||
				move.promotedToPiece == PIECE.k ||
				move.promotedToPiece == PIECE.K
			) {
				return false;
			}

			// white cannot promote black pice & vice versa
			if (
				(move.sourcePiece != PIECE.P || move.promotedToPiece < 6) &&
				(move.sourcePiece != PIECE.p || move.promotedToPiece >= 6)
			) {
				return false;
			}

			// current rank should be 1 or 6
			let rank = move.sourceSq / 8;
			if (
				(move.sourcePiece != PIECE.P || rank != 1) &&
				(move.sourcePiece != PIECE.p || rank != 6)
			) {
				return false;
			}
		}
	}

	// bishop & possibly queen
	if (
		(move.sourcePiece == PIECE.B ||
			move.sourcePiece == PIECE.b ||
			// queen moves like a bishop if both rank and file of source & target don't match
			((move.sourcePiece == PIECE.Q || move.sourcePiece == PIECE.q) &&
				move.sourceSq % 8 != move.targetSq % 8 &&
				move.sourceSq / 8 != move.targetSq / 8)) &&
		move.moveFlag == IGocDataTypes.MoveFlag.NoFlag
	) {
		let sr = move.sourceSq / 8;
		let sf = move.sourceSq % 8;
		let tr = move.targetSq / 8;
		let tf = move.targetSq % 8;

		let targetFound = false;

		// check target is daigonal & there exist no blockers
		if (sr < tr && sf < tf) {
			let r = sr + 1;
			let f = sf + 1;
			while (r <= 7 && f <= 7) {
				let sq = r * 8 + f;

				if (sq == move.targetSq) {
					targetFound = true;
					break;
				}

				// check whether blocker exists
				if (((1 << sq) & blockerboard) > 0) {
					break;
				}

				r += 1;
				f += 1;
			}
		}

		if (sr < tr && sf > tf) {
			let r = sr + 1;
			let f = sf - 1;
			while (r <= 7 && f >= 0) {
				let sq = r * 8 + f;

				if (sq == move.targetSq) {
					targetFound = true;
					break;
				}

				// check whether blocker exists
				if (((1 << sq) & blockerboard) > 0) {
					break;
				}

				r += 1;
				f -= 1;
			}
		}

		if (sr > tr && sf > tf) {
			let r = sr - 1;
			let f = sf - 1;
			while (r >= 0 && f >= 0) {
				let sq = r * 8 + f;

				if (sq == move.targetSq) {
					targetFound = true;
					break;
				}

				// check whether blocker exists
				if (((1 << sq) & blockerboard) > 0) {
					break;
				}

				r -= 1;
				f -= 1;
			}
		}
		if (sr > tr && sf < tf) {
			let r = sr - 1;
			let f = sf + 1;
			while (r >= 0 && f <= 7) {
				let sq = r * 8 + f;

				if (sq == move.targetSq) {
					targetFound = true;
					break;
				}

				// check whether blocker exists
				if (((1 << sq) & blockerboard) > 0) {
					break;
				}

				r -= 1;
				f += 1;
			}
		}

		// if targetSq not found, then targetSq isn't positioned diagonally to bishop's pos
		if (targetFound == false) {
			return;
		}
	}

	// rook & possibly queen
	if (
		(move.sourcePiece == IGocDataTypes.Piece.R ||
			move.sourcePiece == IGocDataTypes.Piece.r ||
			// queen moves like a rook if both either of rank and file of source & target match
			((move.sourcePiece == IGocDataTypes.Piece.Q ||
				move.sourcePiece == IGocDataTypes.Piece.q) &&
				(move.sourceSq % 8 == move.targetSq % 8 ||
					move.sourceSq / 8 == move.targetSq / 8))) &&
		move.moveFlag == IGocDataTypes.MoveFlag.NoFlag
	) {
		let sr = move.sourceSq / 8;
		let sf = move.sourceSq % 8;
		let tr = move.targetSq / 8;
		let tf = move.targetSq % 8;

		let targetFound = false;

		// target sq should be either in same file or rank & should not contains any blockers
		if (sr == tr && sf < tf) {
			let f = sf + 1;
			while (f <= 7) {
				let sq = sr * 8 + f;

				if (sq == move.targetSq) {
					targetFound = true;
					break;
				}

				// check whether blocker exists
				if (((1 << sq) & blockerboard) > 0) {
					break;
				}

				f += 1;
			}
		}

		if (sr == tr && sf > tf && sf != 0) {
			let f = sf - 1;
			while (f >= 0) {
				let sq = sr * 8 + f;

				if (sq == move.targetSq) {
					targetFound = true;
					break;
				}

				// check whether blocker exists
				if (((1 << sq) & blockerboard) > 0) {
					break;
				}

				f -= 1;
			}
		}

		if (sr > tr && sf == tf) {
			let r = sr - 1;
			while (r >= 0) {
				let sq = r * 8 + sf;

				if (sq == move.targetSq) {
					targetFound = true;
					break;
				}

				// check whether blocker exists
				if (((1 << sq) & blockerboard) > 0) {
					break;
				}

				r -= 1;
			}
		}
		if (sr < tr && sf == tf) {
			let r = sr + 1;
			while (r <= 7) {
				let sq = r * 8 + sf;

				if (sq == move.targetSq) {
					targetFound = true;
					break;
				}

				// check whether blocker exists
				if (((1 << sq) & blockerboard) > 0) {
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

export function parseIntToPieceChar(val) {
	if (val >= 12) {
		return "";
	}

	if (val == 0) {
		return "p";
	}
	if (val == 1) {
		return "n";
	}
	if (val == 2) {
		return "b";
	}
	if (val == 3) {
		return "r";
	}
	if (val == 4) {
		return "q";
	}
	if (val == 5) {
		return "k";
	}
	if (val == 6) {
		return "P";
	}
	if (val == 7) {
		return "N";
	}
	if (val == 8) {
		return "B";
	}
	if (val == 9) {
		return "R";
	}
	if (val == 10) {
		return "Q";
	}
	if (val == 11) {
		return "K";
	}
}

export function parseGameStateToFenString(gameState) {
	let boardMap = [];

	// make every index 12 for identifying empty squares
	for (let index = 0; index < 64; index++) {
		boardMap[index] = 12;
	}

	for (let pIndex = 0; pIndex < 12; pIndex++) {
		let board = gameState.bitboards[pIndex];
		for (let index = 0; index < 64; index++) {
			if (board & (1 << index != 0)) {
				boardMap[index] = pIndex;
			}
		}
	}

	// convert board map to string
	let emptySquares = 0;
	for (let index = 0; index < 64; index++) {
		if (index % 8 == 0 && index != 0) {
			if (emptySquares != 0) {
				fen += `${emptySquares}`;
				emptySquares = 0;
			}
			fen += `/`;
		}

		// check empty squares
		if (boardMap[index] == 12) {
			emptySquares += 1;
		} else {
			// append accumulated empty squares
			if (emptySquares != 0) {
				fen += `${emptySquares}`;
				emptySquares = 0;
			}
			// append piece char
			fen += `${parseIntToPieceChar(boardMap[index])}`;
		}
	}

	// side
	if (gameState.side == 0) {
		fen += " w ";
	} else {
		fen += " b ";
	}

	// castling rights
	let castlingAdded = false;
	if (gameState.wkC == true) {
		fen += "K";
		castlingAdded = true;
	}
	if (gameState.wqC == true) {
		fen += "Q";
		castlingAdded = true;
	}
	if (gameState.bkC == true) {
		fen += "k";
		castlingAdded = true;
	}
	if (gameState.bqC == true) {
		fen += "q";
		castlingAdded = true;
	}
	if (castlingAdded == false) {
		fen += "-";
	}

	// enpassant sq
	if (gameState.enpassantSq > 0) {
		fen += ` ${gameState.enpassantSq} `;
	} else {
		fen += " - ";
	}

	// half move count
	fen += `${gameState.halfMoveCount} `;

	// moves
	fen += `${gameState.moveCount / 2}`;
}

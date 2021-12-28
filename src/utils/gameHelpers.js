export function parseBoardString(boardString) {
	const pieceMaps = boardString.split("|");
	const bitboards = [];
	pieceMaps.forEach((map) => {
		bitboards.push(parseInt(map, 2));
	});
	return bitboards;
}

export const PIECE = {
	p: 0n,
	n: 1n,
	b: 2n,
	r: 3n,
	q: 4n,
	k: 5n,
	P: 6n,
	N: 7n,
	B: 8n,
	R: 9n,
	Q: 10n,
	K: 11n,
	uk: 12n,
};

export const FILE_VALIDATION = {
	notAFile: 18374403900871474942n,
	notHFile: 9187201950435737471n,
	notHGFile: 4557430888798830399n,
	notABFile: 18229723555195321596n,
};

export const MOVE_FLAG = {
	NoFlag: 0n,
	Castle: 1n,
	PawnPromotion: 2n,
};

export function getBlockerboard(bitboards) {
	let blockerboard = 0n;
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
	let sr = square / 8n;
	let sf = square % 8n;

	let r = sr + 1n;
	let f = sf + 1n;

	// potential attacking sqaures
	let aBishopB = bitboards[attackingPiece];
	let attacks = 0n;
	while (r <= 7n && f <= 7n) {
		let sq = r * 8n + f;
		let sqPosB = 1n << sq;

		if (sqPosB & (aBishopB !== 0n)) {
			attacks |= sqPosB;
			break;
		} else if (sqPosB & (blockboard !== 0n)) break;

		r += 1n;
		f += 1n;
	}

	r = sr + 1n;
	f = sf - 1n;
	while (r <= 7n && f >= 0n) {
		let sq = r * 8n + f;
		let sqPosB = 1n << sq;

		if (sqPosB & (aBishopB !== 0n)) {
			attacks |= sqPosB;
			break;
		} else if (sqPosB & (blockboard !== 0n)) break;

		r += 1n;
		f -= 1n;
	}

	r = sr - 1n;
	f = sf + 1n;
	while (f <= 7n && r >= 0n) {
		let sq = r * 8n + f;
		let sqPosB = 1n << sq;

		if (sqPosB & (aBishopB !== 0n)) {
			attacks |= sqPosB;
			break;
		} else if (sqPosB & (blockboard !== 0n)) break;

		f += 1n;
		r -= 1n;
	}

	r = sr - 1n;
	f = sf - 1n;
	while (r >= 0 && f >= 0) {
		let sq = r * 8n + f;
		let sqPosB = 1n << sq;

		if (sqPosB & (aBishopB !== 0n)) {
			attacks |= sqPosB;
			break;
		} else if (sqPosB & (blockboard !== 0n)) break;

		r -= 1n;
		f -= 1n;
	}
	return attacks;
}

export function getRookAttacks(attackingPiece, square, blockboard, bitboards) {
	let sr = square / 8n;
	let sf = square % 8n;

	let r = sr + 1n;
	let f = 0n;

	// potential attacking sqaures
	let aRookB = bitboards[attackingPiece];
	let attacks;
	while (r <= 7n) {
		let sq = r * 8n + sf;
		let sqPosB = 1n << sq;

		if (aRookB & (sqPosB !== 0n)) {
			attacks |= sqPosB;
			break;
		} else if (sqPosB & (blockboard !== 0n)) break;

		r += 1n;
	}

	f = sf + 1n;
	while (f <= 7n) {
		let sq = sr * 8n + f;
		let sqPosB = 1n << sq;

		if (aRookB & (sqPosB !== 0n)) {
			attacks |= sqPosB;
			break;
		} else if (sqPosB & (blockboard !== 0n)) break;

		attacks |= sqPosB;
		f += 1n;
	}

	r = sr - 1n;
	while (r >= 0n) {
		let sq = r * 8n + sf;
		let sqPosB = 1n << sq;

		if (aRookB & (sqPosB !== 0n)) {
			attacks |= sqPosB;
			break;
		} else if (sqPosB & (blockboard !== 0n)) break;

		attacks |= sqPosB;
		r -= 1n;
	}

	f = sf - 1n;
	while (f >= 0n) {
		let sq = sr * 8n + f;
		let sqPosB = 1n << sq;

		if (aRookB & (sqPosB !== 0n)) {
			attacks |= sqPosB;
			break;
		} else if (sqPosB & (blockboard !== 0n)) break;

		attacks |= sqPosB;

		f -= 1n;
	}
	return attacks;
}

export function getPawnAttacks(square, side) {
	let sqBitboard = 1n << square;
	let attacks = 0n;
	// white pawn
	if (side === 0n) {
		if ((sqBitboard >> 7n) & (FILE_VALIDATION.notAFile !== 0n))
			attacks |= sqBitboard >> 7n;
		if ((sqBitboard >> 9n) & (FILE_VALIDATION.notHFile !== 0n))
			attacks |= sqBitboard >> 9n;
	}
	// black pawn
	else {
		if ((sqBitboard << 9n) & (FILE_VALIDATION.notAFile !== 0n))
			attacks |= sqBitboard << 9n;
		if ((sqBitboard << 7n) & (FILE_VALIDATION.notHFile !== 0n))
			attacks |= sqBitboard << 7n;
	}
	return attacks;
}

export function getKingAttacks(square) {
	let sqBitboard = 1n << square;
	let attacks = 0n;
	// upwards
	if (sqBitboard >> 8n !== 0n) attacks |= sqBitboard >> 8n;
	if ((sqBitboard >> 9n) & (FILE_VALIDATION.notHFile !== 0n))
		attacks |= sqBitboard >> 9n;
	if ((sqBitboard >> 7n) & (FILE_VALIDATION.notAFile !== 0n))
		attacks |= sqBitboard >> 7n;
	if ((sqBitboard >> 1n) & (FILE_VALIDATION.notHFile !== 0n))
		attacks |= sqBitboard >> 1n;

	// downwards
	if (sqBitboard << 8n !== 0n) attacks |= sqBitboard << 8n;
	if ((sqBitboard << 9n) & (FILE_VALIDATION.notAFile !== 0n))
		attacks |= sqBitboard << 9n;
	if ((sqBitboard << 7n) & (FILE_VALIDATION.notHFile !== 0n))
		attacks |= sqBitboard << 7n;
	if ((sqBitboard << 1n) & (FILE_VALIDATION.notAFile !== 0n))
		attacks |= sqBitboard << 1n;

	return attacks;
}

export function getKnightAttacks(square) {
	let sqBitboard = 1n << square;
	let attacks = 0n;
	// upwards
	if ((sqBitboard >> 15n) & (FILE_VALIDATION.FILE_VALIDATION.notAFile !== 0n))
		attacks |= sqBitboard >> 15n;
	if ((sqBitboard >> 17n) & (FILE_VALIDATION.notHFile !== 0n))
		attacks |= sqBitboard >> 17n;
	if ((sqBitboard >> 6n) & (FILE_VALIDATION.notABFile !== 0n))
		attacks |= sqBitboard >> 6n;
	if ((sqBitboard >> 10n) & (FILE_VALIDATION.notHGFile !== 0n))
		attacks |= sqBitboard >> 10n;

	// downwards
	if ((sqBitboard << 15n) & (FILE_VALIDATION.notHFile !== 0n))
		attacks |= sqBitboard << 15n;
	if ((sqBitboard << 17n) & (FILE_VALIDATION.notAFile !== 0n))
		attacks |= sqBitboard << 17n;
	if ((sqBitboard << 6n) & (FILE_VALIDATION.notHGFile !== 0n))
		attacks |= sqBitboard << 6n;
	if ((sqBitboard << 10n) & (FILE_VALIDATION.notABFile !== 0n))
		attacks |= sqBitboard << 10n;

	return attacks;
}

export function isSquareAttacked(square, piece, bitboards, blockboard) {
	if (piece === PIECE.uk) {
		return false;
	}

	let side;
	if (piece < 6n) {
		side = 1n;
	}

	// check black pawn attacks on sq
	if (
		side === 0n &&
		getPawnAttacks(square, side) & (bitboards[PIECE.p] !== 0n)
	) {
		return true;
	}

	// check white pawn attacks on sq
	if (
		side === 1n &&
		getPawnAttacks(square, side) & (bitboards[PIECE.P] !== 0n)
	) {
		return true;
	}

	// check kings attacks on sq
	if (
		getKingAttacks(square) &
		((side === 0n ? bitboards[PIECE.k] : bitboards[PIECE.K]) !== 0n)
	) {
		return true;
	}

	// check knight attacks on sq
	if (
		getKnightAttacks(square) &
		((side === 0n ? bitboards[PIECE.n] : bitboards[PIECE.N]) !== 0n)
	) {
		return true;
	}

	// bishop attacks on sq
	let bishopAttacks = getBishopAttacks(
		side === 0n ? PIECE.b : PIECE.B,
		square,
		blockboard,
		bitboards
	);
	if (bishopAttacks !== 0n) {
		return true;
	}

	// rook attacks on sq
	let rookAttacks = getRookAttacks(
		side === 0n ? PIECE.r : PIECE.R,
		square,
		blockboard,
		bitboards
	);
	if (rookAttacks !== 0n) {
		return true;
	}

	// queen attacks on sq
	let queenAttacks =
		getBishopAttacks(
			side === 0n ? PIECE.q : PIECE.Q,
			square,
			blockboard,
			bitboards
		) |
		getRookAttacks(
			side === 0n ? PIECE.q : PIECE.Q,
			square,
			blockboard,
			bitboards
		);
	if (queenAttacks !== 0n) {
		return true;
	}

	return false;
}

export function encodeValuesToMoveValue(
	sourceSq,
	targetSq,
	promotedPiece,
	isCastle,
	side,
	gameId,
	moveCount
) {
	console.log(
		sourceSq,
		targetSq,
		promotedPiece,
		isCastle,
		side,
		gameId,
		moveCount
	);
	let moveValue = 0n;
	moveValue = moveValue | sourceSq;
	moveValue = moveValue | (targetSq << 6n);
	moveValue = moveValue | (promotedPiece << 12n);
	if (isCastle === true) moveValue = moveValue | (1n << 16n);
	moveValue = moveValue | (side << 17n);
	moveValue = moveValue | (gameId << 20n);
	moveValue = moveValue | (moveCount << 36n);
	return moveValue;
}

export function decodeMoveToMoveObj(moveValue, bitboards) {
	let sourceSq = moveValue & 63n;
	let targetSq = (moveValue >> 6n) & 63n;
	let side = (moveValue >> 17n) & 1n;
	let gameId = moveValue >> 20n;
	let moveCount = moveValue >> 36n;

	// flags
	let pawnPromotion = (moveValue >> 12n) & 15n;
	let castleFlag = (moveValue >> 16n) & 1n;

	// set flags
	if (
		!(
			(pawnPromotion > 0n && pawnPromotion < 12n && castleFlag == 0n) ||
			pawnPromotion == 0n
		)
	) {
		return {
			move: {},
			err: true,
		};
	}
	let moveFlag = MOVE_FLAG.NoFlag;
	let promotedToPiece = PIECE.uk;
	if (pawnPromotion != 0n) {
		moveFlag = MOVE_FLAG.PawnPromotion;
		promotedToPiece = pawnPromotion;
	}
	if (castleFlag == 1) {
		moveFlag = MOVE_FLAG.Castle;
	}
	console.log("MOVE FLAG", moveFlag, MOVE_FLAG.NoFlag);

	// set squares
	let moveBySq = 0n;
	let moveLeftShift = false;
	if (targetSq > sourceSq) {
		moveBySq = targetSq - sourceSq;
		moveLeftShift = true;
	} else if (targetSq < sourceSq) {
		moveBySq = sourceSq - targetSq;
		moveLeftShift = false;
	}
	if (targetSq === sourceSq) {
		console.log(" mk m ");
		return {
			move: {},
			err: true,
		};
	}

	// set pieces
	let sourcePiece = PIECE.uk;
	let targetPiece = PIECE.uk;
	let sourcePieceBitBoard = 1n << sourceSq;
	let targetPieceBitBoard = 1n << targetSq;
	for (let index = 0; index < bitboards.length; index++) {
		let board = bitboards[index];
		if ((sourcePieceBitBoard & board) > 0n) {
			sourcePiece = index;
		}
		if ((targetPieceBitBoard & board) > 0n) {
			targetPiece = index;
		}
	}
	if (sourcePiece === PIECE.uk) {
		return {
			move: {},
			err: true,
		};
	}

	return {
		move: {
			sourceSq,
			targetSq,
			side,
			gameId,
			moveCount,
			moveFlag,
			promotedToPiece,
			moveBySq,
			moveLeftShift,
			sourcePiece,
			targetPiece,
			sourcePieceBitBoard,
			targetPieceBitBoard,
		},
		err: false,
	};
}

export function isMoveValid(moveValue, gameState) {
	const { move, err } = decodeMoveToMoveObj(moveValue, gameState.bitboards);

	if (err === true) {
		return false;
	}

	if (gameState.state !== 1n) {
		return false;
	}

	if (move.side !== gameState.side) {
		return false;
	}

	if (gameState.moveCount + 1n !== move.moveCount) {
		return false;
	}

	// source piece should match playing side
	if (gameState.side === 0n && move.sourcePiece < 6n) {
		// sourcePiece is black, when side is white
		return false;
	}
	if (gameState.side === 1n && move.sourcePiece >= 6n) {
		// sourcePiece is white, when side is black
		return false;
	}

	// target piece cannot be of playiing side
	if (
		gameState.side === 0n &&
		move.targetPiece !== PIECE.uk &&
		move.targetPiece >= 6n
	) {
		return false;
	}
	if (gameState.side === 1n && move.targetPiece < 6n) {
		return false;
	}

	let blockerboard = getBlockerboard(gameState.bitboards);

	if (move.moveFlag === MOVE_FLAG.Castle) {
		if (move.sourcePiece !== PIECE.K && move.sourcePiece !== PIECE.k) {
			return false;
		}

		// white king
		if (move.sourcePiece === PIECE.K) {
			// king should be on original pos
			if (move.sourceSq !== 60n) {
				return false;
			}

			// targetSq can only be 62 or 58
			if (move.targetSq !== 62n && move.targetSq !== 58n) {
				return false;
			}

			// king side castling
			if (move.targetSq === 62n) {
				if (gameState.wkC === false) {
					return false;
				}

				// rook should be on original pos
				if ((1n << 63n) & (gameState.bitboards[PIECE.R] === 0n)) {
					return false;
				}

				// no attacks to king and thru passage
				if (
					isSquareAttacked(
						60n,
						move.sourcePiece,
						gameState.bitboards,
						blockerboard
					) ||
					isSquareAttacked(
						61n,
						move.sourcePiece,
						gameState.bitboards,
						blockerboard
					) ||
					isSquareAttacked(
						62n,
						move.sourcePiece,
						gameState.bitboards,
						blockerboard
					)
				) {
					return false;
				}

				// passage should be empty
				if (
					((1n << 61n) & blockerboard) !== 0n ||
					((1n << 62n) & blockerboard) !== 0n
				) {
					return false;
				}
			}

			// queen side castling
			if (move.targetSq === 58n) {
				if (gameState.wqC === false) {
					return false;
				}

				// rook should on original pos
				if ((1n << 56n) & (gameState.bitboards[PIECE.R] === 0n)) {
					return false;
				}

				// no attacks to king and thru passage
				if (
					isSquareAttacked(
						60n,
						move.sourcePiece,
						gameState.bitboards,
						blockerboard
					) ||
					isSquareAttacked(
						59n,
						move.sourcePiece,
						gameState.bitboards,
						blockerboard
					) ||
					isSquareAttacked(
						58n,
						move.sourcePiece,
						gameState.bitboards,
						blockerboard
					)
				) {
					return false;
				}

				// passage should be empty
				if (
					((1n << 57n) & blockerboard) !== 0n ||
					((1n << 58n) & blockerboard) !== 0n ||
					((1n << 59n) & blockerboard) !== 0n
				) {
					return false;
				}
			}
		}

		// black king
		if (move.sourcePiece === PIECE.k) {
			// king should on original pos
			if (move.sourceSq !== 4n) {
				return false;
			}

			// targetSq can only be 2 or 6
			if (move.targetSq !== 2n && move.targetSq !== 6n) {
				return false;
			}

			// king side castling
			if (move.targetSq === 6n) {
				if (gameState.bkC === false) {
					return false;
				}

				// rook should be on 7
				if ((1n << 7n) & (gameState.bitboards[PIECE.r] === 0n)) {
					return false;
				}

				// no attacks on king sq & thru sqaures
				if (
					isSquareAttacked(
						4n,
						move.sourcePiece,
						gameState.bitboards,
						blockerboard
					) ||
					isSquareAttacked(
						5n,
						move.sourcePiece,
						gameState.bitboards,
						blockerboard
					) ||
					isSquareAttacked(
						6n,
						move.sourcePiece,
						gameState.bitboards,
						blockerboard
					)
				) {
					return false;
				}

				// passage should be empty
				if (
					(1n << 5n) & (blockerboard !== 0n) ||
					(1n << 6n) & (blockerboard !== 0n)
				) {
					return false;
				}
			}

			// queen side castling
			if (move.targetSq === 2n) {
				if (gameState.bqC === false) {
					return false;
				}

				// rook should be on 0
				if (1n & (gameState.bitboards[PIECE.r] === 0n)) {
					return false;
				}

				// no attacks on king sq & thru squares
				if (
					isSquareAttacked(
						4n,
						move.sourcePiece,
						gameState.bitboards,
						blockerboard
					) ||
					isSquareAttacked(
						3n,
						move.sourcePiece,
						gameState.bitboards,
						blockerboard
					) ||
					isSquareAttacked(
						2n,
						move.sourcePiece,
						gameState.bitboards,
						blockerboard
					)
				) {
					return false;
				}

				// passage should be empty
				if (
					(1n << 3n) & (blockerboard !== 0n) ||
					(1n << 2n) & (blockerboard !== 0n) ||
					(1n << 1n) & (blockerboard !== 0n)
				) {
					return false;
				}
			}
		}
	}

	// king
	if (
		(move.sourcePiece === PIECE.K || move.sourcePiece === PIECE.k) &&
		move.moveFlag === MOVE_FLAG.NoFlag
	) {
		// moveBy can only be 8, 9, 7, 1
		if (
			move.moveBySq !== 8 &&
			move.moveBySq !== 9 &&
			move.moveBySq !== 7 &&
			move.moveBySq !== 1
		) {
			return false;
		}

		// downwards
		if (move.moveLeftShift === true) {
			// can only move inside the board
			if (move.sourcePieceBitBoard << move.moveBySq === 0) {
				return false;
			}

			// check falling off right edge
			if (
				move.moveBySq === 9 &&
				((move.sourcePieceBitBoard << 9) & FILE_VALIDATION.notAFile) ===
					0
			) {
				return false;
			}

			// check falling off left edge
			if (
				move.moveBySq === 7 &&
				((move.sourcePieceBitBoard << 7) & FILE_VALIDATION.notHFile) ===
					0
			) {
				return false;
			}
		}

		// upwards
		if (move.moveLeftShift === false) {
			// can only move inside the board
			if (move.sourcePieceBitBoard >> move.moveBySq === 0) {
				return false;
			}

			// check falling off right edge
			if (
				move.moveBySq === 7 &&
				((move.sourcePieceBitBoard >> 7) & FILE_VALIDATION.notAFile) ===
					0
			) {
				return false;
			}

			// check falling off left edge
			if (
				move.moveBySq === 9 &&
				((move.sourcePieceBitBoard >> 9) & FILE_VALIDATION.notHFile) ===
					0
			) {
				return false;
			}
		}
	}

	// knight
	if (
		(move.sourcePiece === PIECE.N || move.sourcePiece === PIECE.n) &&
		move.moveFlag === MOVE_FLAG.NoFlag
	) {
		if (
			move.moveBySq !== 17 &&
			move.moveBySq !== 15 &&
			move.moveBySq !== 6 &&
			move.moveBySq !== 10
		) {
			return false;
		}

		// downwards
		if (move.moveLeftShift === true) {
			// check falling off right edge
			if (
				move.moveBySq === 17 &&
				((move.sourcePieceBitBoard << 17) &
					FILE_VALIDATION.notAFile) ===
					0
			) {
				return false;
			}

			// check falling off right edge (2 lvl deep)
			if (
				move.moveBySq === 10 &&
				((move.sourcePieceBitBoard << 10) &
					FILE_VALIDATION.notABFile) ===
					0
			) {
				return false;
			}

			// check falling off left edge
			if (
				move.moveBySq === 15 &&
				((move.sourcePieceBitBoard << 15) &
					FILE_VALIDATION.notHFile) ===
					0
			) {
				return false;
			}

			// check falling off left edge (2 lvl deep)
			if (
				move.moveBySq === 6 &&
				((move.sourcePieceBitBoard << 6) &
					FILE_VALIDATION.notHGFile) ===
					0
			) {
				return false;
			}
		}

		// upwards
		if (move.moveLeftShift === false) {
			// check falling off right edge
			if (
				move.moveBySq === 15 &&
				((move.sourcePieceBitBoard >> 15) &
					FILE_VALIDATION.notAFile) ===
					0
			) {
				return false;
			}

			// check falling off right edgen (2 lvl deep)
			if (
				move.moveBySq === 6 &&
				((move.sourcePieceBitBoard >> 6) &
					FILE_VALIDATION.notABFile) ===
					0
			) {
				return false;
			}

			// check falling off left edge
			if (
				move.moveBySq === 17 &&
				((move.sourcePieceBitBoard >> 17) &
					FILE_VALIDATION.notHFile) ===
					0
			) {
				return false;
			}

			// check falling off left edge (2 lvl deep)
			if (
				move.moveBySq === 10 &&
				((move.sourcePieceBitBoard >> 10) &
					FILE_VALIDATION.notHGFile) ===
					0
			) {
				return false;
			}
		}
	}

	// white & black pawns
	if (
		(move.sourcePiece === PIECE.P || move.sourcePiece === PIECE.p) &&
		(move.moveFlag === MOVE_FLAG.NoFlag ||
			move.moveFlag === MOVE_FLAG.PawnPromotion)
	) {
		// white pawns can only move upwards & black pawns can only move downwards
		if (
			(move.sourcePiece !== PIECE.P || move.moveLeftShift !== false) &&
			(move.sourcePiece !== PIECE.p || move.moveLeftShift !== true)
		) {
			return false;
		}

		// diagonal move (i.e.) attack
		if (move.moveBySq === 9 || move.moveBySq === 7) {
			// can only move diagonal if target piece present || it is a enpassant sq
			if (
				move.targetPiece === PIECE.uk &&
				move.targetSq !== gameState.enpassantSq
			) {
				return false;
			}

			// white pawns
			if (move.sourcePiece === PIECE.P) {
				// check falling off right edge
				if (
					move.moveBySq === 7 &&
					((move.sourcePieceBitBoard >> 7) &
						FILE_VALIDATION.notAFile) ===
						0
				) {
					return false;
				}
				// check falling off left edge
				if (
					move.moveBySq === 9 &&
					((move.sourcePieceBitBoard >> 9) &
						FILE_VALIDATION.notHFile) ===
						0
				) {
					return false;
				}
			}
			// black pawns
			else if (move.sourcePiece === PIECE.p) {
				// check falling off right edge
				if (
					move.moveBySq === 9 &&
					((move.sourcePieceBitBoard << 9) &
						FILE_VALIDATION.notAFile) ===
						0
				) {
					return false;
				}

				// check falling off right edge
				if (
					move.moveBySq === 7 &&
					((move.sourcePieceBitBoard << 7) &
						FILE_VALIDATION.notHFile) ===
						0
				) {
					return false;
				}
			}
		} else if (move.moveBySq === 8) {
			// targetSq should be empty
			if (move.targetPiece !== PIECE.uk) {
				return false;
			}

			// cannot go out of the board;
			// up
			if (move.sourcePieceBitBoard >> move.moveBySq === 0) {
				return false;
			}
			// down
			if (move.sourcePieceBitBoard << move.moveBySq === 0) {
				return false;
			}
		} else if (move.moveBySq === 16) {
			// target sq should be empty
			if (move.targetPiece !== PIECE.uk) {
				return false;
			}

			// pawn shouldn't have moved before
			// 71776119061217280 is initial pos of white pawns on board
			// 65280 is initial pos of black pawns on board
			if (
				(move.sourcePiece !== PIECE.P ||
					move.sourcePieceBitBoard & (71776119061217280 === 0)) &&
				(move.sourcePiece !== PIECE.p ||
					move.sourcePieceBitBoard & (65280 === 0))
			) {
				return false;
			}
		} else {
			return false;
		}

		// check for promotion
		if (move.moveFlag === MOVE_FLAG.PawnPromotion) {
			// promoted piece cannot be unkown, pawn, or king
			if (
				move.promotedToPiece === PIECE.uk ||
				move.promotedToPiece === PIECE.p ||
				move.promotedToPiece === PIECE.P ||
				move.promotedToPiece === PIECE.k ||
				move.promotedToPiece === PIECE.K
			) {
				return false;
			}

			// white cannot promote black pice & vice versa
			if (
				(move.sourcePiece !== PIECE.P || move.promotedToPiece < 6) &&
				(move.sourcePiece !== PIECE.p || move.promotedToPiece >= 6)
			) {
				return false;
			}

			// current rank should be 1 or 6
			let rank = move.sourceSq / 8;
			if (
				(move.sourcePiece !== PIECE.P || rank !== 1) &&
				(move.sourcePiece !== PIECE.p || rank !== 6)
			) {
				return false;
			}
		}
	}

	// bishop & possibly queen
	if (
		(move.sourcePiece === PIECE.B ||
			move.sourcePiece === PIECE.b ||
			// queen moves like a bishop if both rank and file of source & target don't match
			((move.sourcePiece === PIECE.Q || move.sourcePiece === PIECE.q) &&
				move.sourceSq % 8 !== move.targetSq % 8 &&
				move.sourceSq / 8 !== move.targetSq / 8)) &&
		move.moveFlag === PIECE.NoFlag
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

				if (sq === move.targetSq) {
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

				if (sq === move.targetSq) {
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

				if (sq === move.targetSq) {
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

				if (sq === move.targetSq) {
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
		if (targetFound === false) {
			return;
		}
	}

	// rook & possibly queen
	if (
		(move.sourcePiece === PIECE.R ||
			move.sourcePiece === PIECE.r ||
			// queen moves like a rook if both either of rank and file of source & target match
			((move.sourcePiece === PIECE.Q || move.sourcePiece === PIECE.q) &&
				(move.sourceSq % 8 === move.targetSq % 8 ||
					move.sourceSq / 8 === move.targetSq / 8))) &&
		move.moveFlag === PIECE.NoFlag
	) {
		let sr = move.sourceSq / 8;
		let sf = move.sourceSq % 8;
		let tr = move.targetSq / 8;
		let tf = move.targetSq % 8;

		let targetFound = false;

		// target sq should be either in same file or rank & should not contains any blockers
		if (sr === tr && sf < tf) {
			let f = sf + 1;
			while (f <= 7) {
				let sq = sr * 8 + f;

				if (sq === move.targetSq) {
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

		if (sr === tr && sf > tf && sf !== 0) {
			let f = sf - 1;
			while (f >= 0) {
				let sq = sr * 8 + f;

				if (sq === move.targetSq) {
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

		if (sr > tr && sf === tf) {
			let r = sr - 1;
			while (r >= 0) {
				let sq = r * 8 + sf;

				if (sq === move.targetSq) {
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
		if (sr < tr && sf === tf) {
			let r = sr + 1;
			while (r <= 7) {
				let sq = r * 8 + sf;

				if (sq === move.targetSq) {
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
		if (targetFound === false) return false;
	}

	return true;
}

export function parseIntToPieceChar(val) {
	if (val >= 12) {
		return "";
	}

	if (val === 0) {
		return "p";
	}
	if (val === 1) {
		return "n";
	}
	if (val === 2) {
		return "b";
	}
	if (val === 3) {
		return "r";
	}
	if (val === 4) {
		return "q";
	}
	if (val === 5) {
		return "k";
	}
	if (val === 6) {
		return "P";
	}
	if (val === 7) {
		return "N";
	}
	if (val === 8) {
		return "B";
	}
	if (val === 9) {
		return "R";
	}
	if (val === 10) {
		return "Q";
	}
	if (val === 11) {
		return "K";
	}
}

export function parseGameStateToFenString(gameState) {
	let boardMap = [];
	let fen = "";
	// make every index 12 for identifying empty squares
	for (let index = 0; index < 64; index++) {
		boardMap.push(12);
	}

	for (let pIndex = 0; pIndex < 12; pIndex++) {
		let board = gameState.bitboards[pIndex];
		let d = "";
		for (let index = 0; index < 64; index++) {
			if ((board & (1n << BigInt(index))) !== 0n) {
				boardMap[index] = pIndex;
				d += `1`;
			} else {
				d += `0`;
			}
		}
	}

	// convert board map to string
	let emptySquares = 0;
	for (let index = 0; index < 64; index++) {
		if (index % 8 === 0 && index !== 0) {
			if (emptySquares !== 0) {
				fen += `${emptySquares}`;
				emptySquares = 0;
			}
			fen += `/`;
		}

		// check empty squares
		if (boardMap[index] === 12) {
			emptySquares += 1;
		} else {
			// append accumulated empty squares
			if (emptySquares !== 0) {
				fen += `${emptySquares}`;
				emptySquares = 0;
			}
			// append piece char
			fen += `${parseIntToPieceChar(boardMap[index])}`;
		}
	}

	// side
	if (gameState.side === 0n) {
		fen += " w ";
	} else {
		fen += " b ";
	}

	// castling rights
	let castlingAdded = false;
	if (gameState.wkC === true) {
		fen += "K";
		castlingAdded = true;
	}
	if (gameState.wqC === true) {
		fen += "Q";
		castlingAdded = true;
	}
	if (gameState.bkC === true) {
		fen += "k";
		castlingAdded = true;
	}
	if (gameState.bqC === true) {
		fen += "q";
		castlingAdded = true;
	}
	if (castlingAdded === false) {
		fen += "-";
	}

	// enpassant sq
	if (gameState.enpassantSq > 0n) {
		fen += ` ${gameState.enpassantSq} `;
	} else {
		fen += " - ";
	}

	// half move count
	fen += `${gameState.halfMoveCount} `;

	// moves
	fen += `${gameState.moveCount / 2n}`;

	return fen;
}

export function parseIntToHex(val) {
	return `0x${Number(val).toString(16)}`;
}

/* global BigInt */

/**
 *
 * TODO List
 * 1. Fix BigInt thing for isMoveValid function
 * 2. Add PM functions to router contract
 * 3. Enabled electing move
 * 4. Buy & sell of outcome tokens of the move
 * 5. Write Math for buy & sell orders (Probably a nice opportunity to recheck old math)
 *
 */

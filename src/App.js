import logo from "./logo.svg";
import "./App.css";
import { Chessboard } from "react-chessboard";
import { useQueryGame } from "./hooks/useQuery";
import {
	isMoveValid,
	MOVE_FLAG,
	parseGameStateToFenString,
	encodeValuesToMoveValue,
} from "./utils/gameHelpers";
import { NumberInput, Flex, NumberInputField, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";

function App() {
	const { result, reexecuteQuery } = useQueryGame(1);

	const [gameState, setGameState] = useState(undefined);
	const [sourceSq, setSourceSq] = useState(0);
	const [targetSq, setTargetSq] = useState(0);
	const [promotedPiece, setPromotedPiece] = useState(0);
	const [castleFlag, setCastleFlag] = useState(0);

	useEffect(() => {
		console.log(!result.data || !result.data.game);
		if (!result.data || !result.data.game) {
			console.log("dwad2qd");
			return;
		}
		console.log("dwad");
		setGameState({
			...result.data.game,
			gameId: BigInt(result.data.game.gameId),
			bitboards: result.data.game.bitboards.map((board) => BigInt(board)),
			state: BigInt(result.data.game.state),
			side: BigInt(result.data.game.side),
			winner: BigInt(result.data.game.winner),
			enpassantSq: BigInt(result.data.game.enpassantSq),
			moveCount: BigInt(result.data.game.moveCount),
			halfMoveCount: BigInt(result.data.game.halfMoveCount),
		});
	}, [result]);

	useEffect(() => {
		if (gameState) {
			const moveValue = encodeValuesToMoveValue(
				BigInt(sourceSq),
				BigInt(targetSq),
				BigInt(promotedPiece),
				false,
				gameState.side,
				gameState.gameId,
				gameState.moveCount + 1n
			);

			const isValidMove = isMoveValid(moveValue, gameState);
			console.log(moveValue, isValidMove);
		}
	}, [sourceSq, targetSq, promotedPiece, castleFlag, gameState]);

	if (!gameState) {
		return <div />;
	}

	return (
		<div className="App">
			<Flex direction={"row"}>
				<Chessboard
					arePiecesDraggable={false}
					position={parseGameStateToFenString(gameState)}
				/>
				<Flex direction={"column"}>
					<NumberInput
						onChange={(val) => {
							setSourceSq(val);
						}}
						value={sourceSq}
					>
						<NumberInputField />
					</NumberInput>
					<NumberInput
						onChange={(val) => {
							setTargetSq(val);
						}}
						value={targetSq}
					>
						<NumberInputField />
					</NumberInput>
					<NumberInput
						onChange={(val) => {
							setPromotedPiece(val);
						}}
						value={promotedPiece}
					>
						<NumberInputField />
					</NumberInput>
					<NumberInput
						onChange={(val) => {
							setCastleFlag(val);
						}}
						value={castleFlag}
					>
						<NumberInputField />
					</NumberInput>
					<Button onClick={() => {}} colorScheme="teal" size="xs">
						Move
					</Button>
				</Flex>
			</Flex>
		</div>
	);
}

export default App;
/* global BigInt */

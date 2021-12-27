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
import { useState } from "react";

function App() {
	const { result, reexecuteQuery } = useQueryGame(1);

	const [sourceSq, setSourceSq] = useState(0);
	const [targetSq, setTargetSq] = useState(0);
	const [promotedPiece, setPromotedPiece] = useState(0);
	const [castleFlag, setCastleFlag] = useState(0);

	if (!result.data || !result.data.game) {
		return <div />;
	}

	const gameState = {
		...result.data.game,
		bitboards: result.data.game.bitboards.map((board) => BigInt(board)),
	};

	const moveValue = encodeValuesToMoveValue(
		sourceSq,
		targetSq,
		promotedPiece,
		false,
		gameState.side,
		gameState.gameId,
		gameState.moveCount + 1
	);

	const isValidMove = isMoveValid(moveValue, gameState);

	console.log(moveValue, isValidMove);

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

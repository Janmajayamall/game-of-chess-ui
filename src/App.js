import logo from "./logo.svg";
import "./App.css";
import { Chessboard } from "react-chessboard";
import { useQueryGame } from "./hooks/useQuery";
import { parseGameStateToFenString } from "./utils/gameHelpers";
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
	// console.log(gameState);

	function encodeInputsToMoveValue() {
		let moveValue = BigInt(0);
		moveValue = moveValue | BigInt(sourceSq);
		moveValue = moveValue | (BigInt(targetSq) << BigInt(6));
		moveValue = moveValue | (BigInt(promotedPiece) << BigInt(12));
		moveValue = moveValue | (BigInt(castleFlag) << BigInt(16));
		moveValue = moveValue | (BigInt(gameState.side) << BigInt(17));
		moveValue = moveValue | (BigInt(gameState.gameId) << BigInt(20));
		moveValue = moveValue | (BigInt(gameState.moveCount + 1) << BigInt(36));
		console.log(moveValue);
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
					<Button
						onClick={() => {
							encodeInputsToMoveValue();
						}}
						colorScheme="teal"
						size="xs"
					>
						Move
					</Button>
				</Flex>
			</Flex>
		</div>
	);
}

export default App;
/* global BigInt */

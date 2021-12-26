import logo from "./logo.svg";
import "./App.css";
import { Chessboard } from "react-chessboard";
import { useQueryGame } from "./hooks/useQuery";
import { parseGameStateToFenString } from "./utils/gameHelpers";

function App() {
	const { result, reexecuteQuery } = useQueryGame(1);
	if (!result.data || !result.data.game) {
		return <div />;
	}

	const gameState = {
		...result.data.game,
		bitboards: result.data.game.bitboards.map((board) => BigInt(board)),
	};

	console.log(gameState);

	return (
		<div className="App">
			<Chessboard
				arePiecesDraggable={false}
				position={parseGameStateToFenString(gameState)}
			/>
		</div>
	);
}

export default App;
/* global BigInt */

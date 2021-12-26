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
	console.log(result.data.game);

	return (
		<div className="App">
			<Chessboard
				arePiecesDraggable={false}
				position={parseGameStateToFenString(result.data.game)}
			/>
		</div>
	);
}

export default App;

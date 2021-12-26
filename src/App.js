import logo from "./logo.svg";
import "./App.css";
import { Chessboard } from "react-chessboard";

function App() {
	return (
		<div className="App">
			<Chessboard
				arePiecesDraggable={false}
				position={
					"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0"
				}
			/>
		</div>
	);
}

export default App;

import { useQuery } from "urql";
import { parseIntToHex } from "../utils/gameHelpers";

const QueryGame = `
	query ($id: ID!) {
		game(id: $id){
			id
            gameId
            bitboards
            state
            side
            winner
            enpassantSq
            moveCount
			halfMoveCount
            bkC
            bqC
            wkC
            wqC
		}
	}
`;

export function useQueryGame(gameId, pause = false) {
	const [result, reexecuteQuery] = useQuery({
		query: QueryGame,
		variables: {
			id: parseIntToHex(gameId),
		},
		pause,
	});
	return {
		result,
		reexecuteQuery,
	};
}

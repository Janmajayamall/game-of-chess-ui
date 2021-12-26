import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createClient, Provider as URQLProvider } from "urql";
import { BrowserRouter as Router } from "react-router-dom";
import { DAppProvider } from "@usedapp/core/packages/core";
import { ChakraProvider } from "@chakra-ui/react";

const client = createClient({
	url:
		"https://api.thegraph.com/subgraphs/name/janmajayamall/game-of-chess-subgraph",
});

ReactDOM.render(
	<React.StrictMode>
		<URQLProvider value={client}>
			{/* <Provider store={store}> */}
			<DAppProvider
				config={{
					supportedChains: [421611],
					// multicallAddresses: {
					// 	421611: "0xed53fa304E7fcbab4E8aCB184F5FC6F69Ed54fF6",
					// },
					readOnlyUrls: {
						421611: "https://rinkeby.arbitrum.io/rpc",
					},
				}}
			>
				<ChakraProvider>
					<Router>
						<App />
					</Router>
				</ChakraProvider>
			</DAppProvider>
			{/* </Provider> */}
		</URQLProvider>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

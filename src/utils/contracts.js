import { addresses } from "./../contracts";
import { utils, Contract } from "ethers";
import GocAbi from "../contracts/abis/Goc.json";
import GocRouterAbi from "../contracts/abis/GocRouter.json";
import TokenAbi from "../contracts/abis/Token.json";

// interfaces
export const gocInterface = new utils.Interface(GocAbi);
export const gocRouterInterface = new utils.Interface(GocRouterAbi);
export const tokenInterface = new utils.Interface(TokenAbi);

// contracts
export const gocContract = new Contract(addresses.Goc, gocInterface);
export const gocRouterContract = new Contract(
	addresses.GocRouter,
	gocRouterInterface
);
export const tokenContract = new Contract(addresses.TestToken, tokenInterface);

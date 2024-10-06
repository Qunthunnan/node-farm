import { error } from "console";
import fs from "fs";
import http from "http";

//Blocking synchronius code
// const test: string = fs.readFileSync("./txt/read-this.txt", "utf-8");

// console.log(test);

// fs.writeFileSync("./txt/newFile.txt", `New file says: \n${test}`);

// console.log(fs.readFileSync("./txt/newFile.txt", "utf-8"));

//Non-Blocking asynchronius code with error handling
// let test: string;
// fs.readFile("./txt/read-this.txt", "utf-8", (error, data) => {
// 	if (!error) {
// 		test = data;
// 		console.log(test);

// 		fs.writeFile(
// 			"./txt/newFile.txt",
// 			`New file says: \n${test}\nLast updated: ${new Date()}`,
// 			(error) => {
// 				if (!error) {
// 					fs.readFile("./txt/newFile.txt", "utf-8", (error, data) => {
// 						if (!error) console.log(data);
// 						else throw error;
// 					});
// 				} else throw error;
// 			},
// 		);
// 	} else throw error;
// });

//http server
const server = http.createServer((request, result) => {
	console.log(`GET`);
	result.end("Helo world!!!🤩");
});

server.listen(5000, "localhost", () => {
	console.log("listening requests on port 5000");
});

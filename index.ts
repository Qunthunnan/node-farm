import { error } from "console";
import fs from "fs";
import path from "path";
import http from "http";
import ulr from "url";

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

const data = fs.readFileSync(`./dev-data/data.json`);

const server = http.createServer((request, result) => {
	const urlPath = request.url;

	switch (urlPath) {
		case "/overview": {
			result.end('"Overwiew content"');
			break;
		}
		case "/admin": {
			result.end('"Admin panel');
			break;
		}
		case "/": {
			result.end('"Main page"');
			break;
		}
		case "/api": {
			if (data) {
				result.writeHead(200, "OK", {
					"Content-Type": "application/json",
				});
				result.end(data);
			} else {
				result.writeHead(500, "Server error: data not found", {
					"Content-type": "text/html",
				});
				result.end("<h1>Data error</h1>");
			}
		}
		default: {
			result.writeHead(404, "Not found 404", {
				"Content-type": "text/html",
				"my-own-headers-key": "my-own-headers-data",
			});
			result.end(`<h1>Not found</h1>`);
		}
	}

	console.log(`GET`);
});

server.listen(5000, "localhost", () => {
	console.log("listening requests on port 5000");
});

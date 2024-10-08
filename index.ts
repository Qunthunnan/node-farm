import { error } from "console";
import fs from "fs";
import http from "http";
import * as url from "url";

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

interface IProduct {
	id: number;
	productName: string;
	image: string;
	from: string;
	nutrients: string;
	quantity: string;
	price: string;
	organic: boolean;
	description: string;
}

function buildProductTemplate(template: string, data: IProduct): string {
	let newTemplate = template.replace(/{%IMAGE%}/g, data.image);
	newTemplate = newTemplate.replace(/{%PRODUCT_NAME%}/g, data.productName);
	newTemplate = newTemplate.replace(/{%FROM%}/g, data.from);
	newTemplate = newTemplate.replace(/{%NUTRIENTS%}/g, data.nutrients);
	newTemplate = newTemplate.replace(/{%DESCRIPTION%}/g, data.description);
	newTemplate = newTemplate.replace(/{%QUANTITY%}/g, data.quantity);
	newTemplate = newTemplate.replace(/{%PRICE%}/g, data.price);
	newTemplate = newTemplate.replace(/{%ID%}/g, `${data.id}`);

	if (data.organic) {
		newTemplate = newTemplate.replace(
			/{%IS_ORGANIC%}/g,
			"product__organic--true",
		);
		newTemplate = newTemplate.replace(/{%IS_ORGANIC_WORD%}/g, "Organic!");
	} else {
		newTemplate = newTemplate.replace(/{%IS_ORGANIC_WORD%}/g, "");
		newTemplate = newTemplate.replace(/{%IS_ORGANIC%}/g, "");
	}

	return newTemplate;
}

function buildOverviewTemplate(
	mainTemplate: string,
	productTemplate: string,
): string {
	const productsTemplates = data.map((product) =>
		buildProductTemplate(productTemplate, product),
	);
	return mainTemplate.replace(/{%PRODUCTS%}/g, productsTemplates.join(""));
}

const dataFile = fs.readFileSync(`./dev-data/data.json`, "utf-8");

const data: IProduct[] = JSON.parse(dataFile);
const overviewTemp = fs.readFileSync(
	`./templates/overview-template.html`,
	"utf-8",
);
const productCardTemp = fs.readFileSync(
	`./templates/product-card-template.html`,
	"utf-8",
);
const productTemp = fs.readFileSync(
	`./templates/product-template.html`,
	"utf-8",
);

const server = http.createServer((request, result) => {
	const { pathname, query } = url.parse(request.url as string, true);

	switch (pathname) {
		case "/overview": {
			const newOverviewTemplate = buildOverviewTemplate(
				overviewTemp,
				productCardTemp,
			);

			result.writeHead(200, "text/HTML");
			result.end(newOverviewTemplate);
			break;
		}
		case "/products": {
			if (query["id"] && data[+query["id"]]) {
				const newProductTemplate = buildProductTemplate(
					productTemp,
					data[+query["id"]],
				);

				result.writeHead(200, "text/HTML");
				result.end(newProductTemplate);
			} else {
				result.writeHead(404, "Server error: data not found", {
					"Content-type": "text/html",
				});
				result.end("<h1>Data error</h1>");
			}
			break;
		}
		case "/": {
			const newOverviewTemplate = buildOverviewTemplate(
				overviewTemp,
				productCardTemp,
			);

			result.writeHead(200, "text/HTML");
			result.end(newOverviewTemplate);
			break;
		}
		case "/admin": {
			result.end('"Admin panel');
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

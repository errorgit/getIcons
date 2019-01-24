const program = require("commander");
const fs = require('fs');
const { exec } = require("child_process");

program
	.version("0.1.0")
	.option("-f, --file <filename>", "operate a file");

	program.parse(process.argv)

	if ( program.file) {
		let file = program.file

		if ( !fs.statSync(file).isFile()) {
			console.log('not a file');
			return;
		}

		let fileSuffix = file.match(/(?<=[\.])\w+\b/)[0];

		if ( fileSuffix !== 'css' ){
			console.log('not a css file')
			return;
		}

		const s = fs.readFileSync(file).toString();
		let classNames = s.match(/(?<=\.)icon-\w+(?=:)/g);
		let codes = s.match(/(?<=content:\s*").+(?=")/g);
		let commonClass = s.match(/(?<=\.)icon\w+\b/)[0];


		let items = '';

		for ( let i in classNames) {
			items += `<li style="text-align:center; list-style=none;">
							<p>${codes[i]}</p>
							<p class="${commonClass} ${classNames[i]}" style="font-size: 24px;"></p>
							<p>${classNames[i]}</p>
						</li>`
		}

		let result = `<!DOCTYPE html>
										<html lang="en">
										<head>
											<meta charset="UTF-8">
											<meta name="viewport" content="width=device-width, initial-scale=1.0">
											<meta http-equiv="X-UA-Compatible" content="ie=edge">
											<title>Document</title>
											<link rel="stylesheet" href="${file}">
										</head>
										<style>
											li{
												text-align: center;
												list-style: none;
												border: 1px solid #eee;
												flex: 1 1 150px;				
											}
											ul {
												display: flex;
												flex-wrap: wrap;
												justify-content: space-around;
											}
										</style>
										<body>
											<ul>
												${items}
											</ul>
										</body>
										</html>`;
		
			fs.writeFileSync('./index.html', result);
			exec('index.html');
	} else {
		console.log('need a file');
	}
